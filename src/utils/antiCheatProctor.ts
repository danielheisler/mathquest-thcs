import { AntiCheatIncident } from '../types/math';

export const ANTI_CHEAT_CHANNEL_NAME = 'mathquest_anti_cheat_channel';
export const ANTI_CHEAT_STORAGE_KEY = 'mathquest_live_anti_cheat_alerts';
export const ANTI_CHEAT_REMOTE_WARNING_KEY = 'mathquest_remote_teacher_warning';

class AntiCheatProctorManager {
  private channel: BroadcastChannel | null = null;
  private isMonitoring: boolean = false;
  private studentId: string = '';
  private studentName: string = '';
  private classCode: string = '20112002';
  private currentQuestionNumber: number = 1;
  private tabSwitchesCount: number = 0;
  private totalAwayTimeSec: number = 0;
  private awayStartTime: number = 0;
  private incidents: AntiCheatIncident[] = [];
  private onWarningCallback: ((incident: AntiCheatIncident, count: number) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(ANTI_CHEAT_CHANNEL_NAME);
      } catch (e) {
        console.warn('BroadcastChannel not supported or restricted:', e);
      }
    }
  }

  public startMonitoring(
    studentId: string,
    studentName: string,
    classCode: string = '20112002',
    onWarning?: (incident: AntiCheatIncident, count: number) => void
  ) {
    this.stopMonitoring();
    this.isMonitoring = true;
    this.studentId = studentId;
    this.studentName = studentName;
    this.classCode = classCode;
    this.tabSwitchesCount = 0;
    this.totalAwayTimeSec = 0;
    this.incidents = [];
    this.onWarningCallback = onWarning || null;

    if (typeof window === 'undefined') return;

    // Attach visibility listener
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    // Attach window blur listener
    window.addEventListener('blur', this.handleWindowBlur);
    // Attach copy & contextmenu block
    window.addEventListener('contextmenu', this.handleContextMenu);
    window.addEventListener('keydown', this.handleKeyDown);

    // Notify teacher that student started session
    this.broadcastToTeacher({
      type: 'SESSION_START',
      studentId: this.studentId,
      studentName: this.studentName,
      classCode: this.classCode,
      timestamp: new Date().toLocaleTimeString('vi-VN')
    });
  }

  public updateQuestionNumber(qNum: number) {
    this.currentQuestionNumber = qNum;
  }

  public stopMonitoring(): {
    tabSwitchesCount: number;
    totalAwayTimeSec: number;
    integrityStatus: 'honest' | 'suspicious' | 'cheated';
    incidents: AntiCheatIncident[];
  } {
    if (typeof window !== 'undefined') {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
      window.removeEventListener('blur', this.handleWindowBlur);
      window.removeEventListener('contextmenu', this.handleContextMenu);
      window.removeEventListener('keydown', this.handleKeyDown);
    }

    this.isMonitoring = false;

    let integrityStatus: 'honest' | 'suspicious' | 'cheated' = 'honest';
    if (this.tabSwitchesCount >= 3 || this.totalAwayTimeSec > 30) {
      integrityStatus = 'cheated';
    } else if (this.tabSwitchesCount > 0 || this.totalAwayTimeSec > 5) {
      integrityStatus = 'suspicious';
    }

    return {
      tabSwitchesCount: this.tabSwitchesCount,
      totalAwayTimeSec: this.totalAwayTimeSec,
      integrityStatus,
      incidents: [...this.incidents]
    };
  }

  private handleVisibilityChange = () => {
    if (!this.isMonitoring) return;

    if (document.hidden) {
      // Student left the tab!
      this.awayStartTime = Date.now();
      this.tabSwitchesCount++;

      const incident: AntiCheatIncident = {
        id: `inc-${Date.now()}`,
        studentId: this.studentId,
        studentName: this.studentName,
        classCode: this.classCode,
        timestamp: new Date().toLocaleTimeString('vi-VN'),
        type: 'tab_switch',
        durationSec: 0,
        questionNumber: this.currentQuestionNumber,
        details: `Học sinh đã chuyển sang tab trình duyệt khác tại Câu số ${this.currentQuestionNumber} (Lần ${this.tabSwitchesCount})`,
        severity: this.tabSwitchesCount >= 3 ? 'high' : this.tabSwitchesCount >= 2 ? 'medium' : 'low'
      };

      this.incidents.push(incident);
      this.broadcastToTeacher({
        type: 'TAB_SWITCH',
        incident,
        totalSwitches: this.tabSwitchesCount
      });

      if (this.onWarningCallback) {
        this.onWarningCallback(incident, this.tabSwitchesCount);
      }
    } else {
      // Student returned to the tab!
      if (this.awayStartTime > 0) {
        const durationSec = Math.max(1, Math.round((Date.now() - this.awayStartTime) / 1000));
        this.totalAwayTimeSec += durationSec;
        this.awayStartTime = 0;

        // Update last incident duration
        if (this.incidents.length > 0) {
          this.incidents[this.incidents.length - 1].durationSec = durationSec;
          this.incidents[this.incidents.length - 1].details += ` · Thời gian rời tab: ${durationSec} giây`;
        }

        this.broadcastToTeacher({
          type: 'TAB_RETURN',
          studentId: this.studentId,
          studentName: this.studentName,
          durationSec,
          totalAwayTimeSec: this.totalAwayTimeSec
        });
      }
    }
  };

  private handleWindowBlur = () => {
    if (!this.isMonitoring || document.hidden) return; // Handled by visibilitychange if tab hidden
    // Window lost focus without hiding tab (e.g., clicked another window/split screen)
    this.tabSwitchesCount++;
    const incident: AntiCheatIncident = {
      id: `inc-blur-${Date.now()}`,
      studentId: this.studentId,
      studentName: this.studentName,
      classCode: this.classCode,
      timestamp: new Date().toLocaleTimeString('vi-VN'),
      type: 'window_blur',
      durationSec: 2,
      questionNumber: this.currentQuestionNumber,
      details: `Học sinh rời tiêu điểm màn hình bài làm (Alt-Tab hoặc mở ứng dụng ngoài) tại Câu ${this.currentQuestionNumber}`,
      severity: this.tabSwitchesCount >= 3 ? 'high' : 'medium'
    };

    this.incidents.push(incident);
    this.broadcastToTeacher({
      type: 'WINDOW_BLUR',
      incident,
      totalSwitches: this.tabSwitchesCount
    });

    if (this.onWarningCallback) {
      this.onWarningCallback(incident, this.tabSwitchesCount);
    }
  };

  private handleContextMenu = (e: MouseEvent) => {
    if (!this.isMonitoring) return;
    e.preventDefault();
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (!this.isMonitoring) return;
    // Block Ctrl+C, Ctrl+V, F12
    if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'C' || e.key === 'V')) {
      e.preventDefault();
    }
  };

  private broadcastToTeacher(payload: any) {
    // 1. Post to BroadcastChannel
    if (this.channel) {
      try {
        this.channel.postMessage(payload);
      } catch (err) {
        console.warn('Channel post error:', err);
      }
    }

    // 2. Write to localStorage to trigger storage events across windows
    if (typeof localStorage !== 'undefined') {
      try {
        const existingStr = localStorage.getItem(ANTI_CHEAT_STORAGE_KEY);
        const existing: any[] = existingStr ? JSON.parse(existingStr) : [];
        const nextList = [payload, ...existing].slice(0, 50); // Keep last 50 alerts
        localStorage.setItem(ANTI_CHEAT_STORAGE_KEY, JSON.stringify(nextList));
        // Force storage event trigger with unique timestamp
        localStorage.setItem('mathquest_anti_cheat_pulse', Date.now().toString());
      } catch (err) {
        console.warn('Storage alert sync error:', err);
      }
    }
  }

  public getSessionStats() {
    return {
      isMonitoring: this.isMonitoring,
      tabSwitchesCount: this.tabSwitchesCount,
      totalAwayTimeSec: this.totalAwayTimeSec,
      incidents: [...this.incidents]
    };
  }
}

export const antiCheatProctor = new AntiCheatProctorManager();
