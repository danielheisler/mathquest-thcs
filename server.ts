import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { generateWordEssayBuffer } from './src/utils/wordEssayExporter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const MODEL_NAME = 'gemini-4-hydrogen';

function createGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function getExamStructurePrompt(
  grade: number,
  semester: string,
  examType: string,
  difficulty: string,
  topicPrompt: string,
  customCounts?: { mc: number; tf: number; sa: number; essay: number }
) {
  const difficultyLabel =
    difficulty === 'basic'
      ? 'Cơ bản (ưu tiên Nhận biết 45%, Thông hiểu 35%, Vận dụng 15%, Vận dụng cao 5%)'
      : difficulty === 'advanced'
        ? 'Nâng cao / Bồi dưỡng HSG (Nhận biết 20%, Thông hiểu 25%, Vận dụng 35%, Vận dụng cao 20%)'
        : 'Chuẩn Chương trình GDPT 2018 (Nhận biết 30%, Thông hiểu 30%, Vận dụng 30%, Vận dụng cao 10%)';

  const topicInstruction = topicPrompt?.trim()
    ? `Trọng tâm kiến thức / yêu cầu cụ thể của giáo viên: "${topicPrompt.trim()}".`
    : `Tổng hợp kiến thức trọng tâm Toán lớp ${grade} ${semester === 'HK1' ? 'Học kỳ 1' : 'Học kỳ 2'} theo chương trình GDPT 2018 (Kết nối tri thức / Chân trời sáng tạo / Cánh diều).`;

  if (examType === 'quiz_15m') {
    return {
      durationMinutes: 15,
      structureInstructions: `
BẮT BUỘC tuân thủ chính xác cấu trúc ĐỀ KIỂM TRA 15 PHÚT gồm ĐÚNG 6 CÂU (Tổng 10 điểm):
- Phần I (section = "I", sectionTitle = "PHẦN I. TRẮC NGHIỆM KHÁCH QUAN (4,0 điểm - 4 câu)"):
  + Tạo ĐÚNG 4 câu (number từ 1 đến 4), questionType = "multiple_choice", mỗi câu points = 1.0.
  + Mỗi câu có đúng 4 phương án A, B, C, D trong mảng options (KHÔNG ghi chữ "A.", "B." ở đầu chuỗi option), correctAnswerIndex là 0..3.
- Phần II (section = "II", sectionTitle = "PHẦN II. TỰ LUẬN (6,0 điểm - 2 câu)"):
  + Tạo ĐÚNG 2 câu (number từ 5 đến 6), questionType = "essay", mỗi câu points = 3.0.
  + Mỗi câu có sampleSolution (lời giải mẫu trình bày từng bước cực kỳ chi tiết) và rubric (mảng các bước chấm điểm cộng lại đúng 3.0 điểm).
`,
      topicInstruction,
      difficultyLabel,
    };
  }

  if (examType === 'custom' && customCounts) {
    const mc = Math.max(0, Math.min(16, Number(customCounts.mc) || 0));
    const tf = Math.max(0, Math.min(4, Number(customCounts.tf) || 0));
    const sa = Math.max(0, Math.min(6, Number(customCounts.sa) || 0));
    const essay = Math.max(0, Math.min(6, Number(customCounts.essay) || 0));
    const totalQ = mc + tf + sa + essay || 6;
    const estDuration = Math.max(15, Math.min(90, mc * 2 + tf * 6 + sa * 5 + essay * 8));

    return {
      durationMinutes: estDuration,
      structureInstructions: `
BẮT BUỘC tạo đề ôn tập chuyên đề gồm ĐÚNG ${totalQ} câu (Tổng điểm làm tròn đúng 10.0 điểm):
${mc > 0 ? `- Phần I (section = "I", sectionTitle = "PHẦN I. TRẮC NGHIỆM KHÁCH QUAN"): ĐÚNG ${mc} câu questionType = "multiple_choice" (mỗi câu 4 phương án options, correctAnswerIndex 0..3).` : ''}
${tf > 0 ? `- Phần II (section = "II", sectionTitle = "PHẦN II. TRẮC NGHIỆM ĐÚNG / SAI"): ĐÚNG ${tf} câu questionType = "true_false" (mỗi câu có ĐÚNG 4 ý subQuestions với label "a","b","c","d", isCorrect boolean và explanation cho từng ý).` : ''}
${sa > 0 ? `- Phần III (section = "III", sectionTitle = "PHẦN III. TRẢ LỜI NGẮN"): ĐÚNG ${sa} câu questionType = "short_answer" (có correctShortAnswer và acceptedAnswers).` : ''}
${essay > 0 ? `- Phần IV (section = "IV", sectionTitle = "PHẦN IV. TỰ LUẬN"): ĐÚNG ${essay} câu questionType = "essay" (có sampleSolution chi tiết từng bước và rubric chấm điểm).` : ''}
Đảm bảo tổng thuộc tính points của toàn bộ các câu đúng bằng 10.0.
`,
      topicInstruction,
      difficultyLabel,
    };
  }

  // Default: midterm (60p) or final (90p)
  const isFinal = examType === 'final';
  return {
    durationMinutes: isFinal ? 90 : 60,
    structureInstructions: `
BẮT BUỘC tuân thủ chính xác cấu trúc ĐỀ THI ${isFinal ? 'CUỐI KỲ' : 'GIỮA KỲ'} gồm ĐÚNG 20 CÂU (Tổng 10,0 điểm):
- Phần I (section = "I", sectionTitle = "PHẦN I. TRẮC NGHIỆM 4 ĐÁP ÁN (3,0 điểm - 12 câu)"):
  + Tạo ĐÚNG 12 câu (number từ 1 đến 12), questionType = "multiple_choice", mỗi câu points = 0.25.
  + Mỗi câu có đúng 4 phương án trong options (không lặp đáp án, không ghi tiền tố "A. "), correctAnswerIndex từ 0 đến 3.
- Phần II (section = "II", sectionTitle = "PHẦN II. TRẮC NGHIỆM ĐÚNG / SAI (1,0 điểm - 1 câu gồm 4 ý a, b, c, d)"):
  + Tạo ĐÚNG 1 câu (number = 13), questionType = "true_false", points = 1.0.
  + subQuestions phải có ĐÚNG 4 phần tử với label lần lượt là "a", "b", "c", "d", có cả ý đúng và ý sai, mỗi ý đều có explanation giải thích rõ vì sao Đúng hoặc Sai.
- Phần III (section = "III", sectionTitle = "PHẦN III. TRẢ LỜI NGẮN (1,0 điểm - 2 câu)"):
  + Tạo ĐÚNG 2 câu (number từ 14 đến 15), questionType = "short_answer", mỗi câu points = 0.5.
  + Có correctShortAnswer ngắn gọn (số hoặc biểu thức đơn giản) và acceptedAnswers là mảng các cách viết tương đương.
- Phần IV (section = "IV", sectionTitle = "PHẦN IV. TỰ LUẬN (5,0 điểm - 5 câu)"):
  + Tạo ĐÚNG 5 câu (number từ 16 đến 20), questionType = "essay", mỗi câu points = 1.0 (có thể gồm Đại số, Giải bài toán thực tế, Hình học, Chứng minh/Vận dụng cao).
  + Mỗi câu PHẢI có sampleSolution (lời giải trình bày rõ ràng theo từng bước) và rubric (mảng các bước chấm điểm cộng lại đúng 1.0 điểm).
`,
    topicInstruction,
    difficultyLabel,
  };
}

const examResponseSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: 'Tiêu đề chính thức của đề thi bằng tiếng Việt' },
    description: { type: Type.STRING, description: 'Mô tả ngắn gọn nội dung và ma trận đề thi' },
    matrix: {
      type: Type.OBJECT,
      properties: {
        nhanBiet: { type: Type.INTEGER },
        thongHieu: { type: Type.INTEGER },
        vanDung: { type: Type.INTEGER },
        vanDungCao: { type: Type.INTEGER },
      },
      required: ['nhanBiet', 'thongHieu', 'vanDung', 'vanDungCao'],
    },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          number: { type: Type.INTEGER },
          section: { type: Type.STRING, description: 'Một trong: I, II, III, IV' },
          sectionTitle: { type: Type.STRING },
          questionType: {
            type: Type.STRING,
            description: 'Một trong: multiple_choice, true_false, short_answer, essay',
          },
          questionText: { type: Type.STRING, description: 'Đề bài rõ ràng, chính xác bằng tiếng Việt' },
          formula: { type: Type.STRING, description: 'Công thức LaTeX thuần (không có dấu $ bao quanh) nếu cần hiển thị nổi bật, ngược lại để chuỗi rỗng' },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '4 phương án cho multiple_choice (mảng rỗng nếu không phải multiple_choice)',
          },
          correctAnswerIndex: { type: Type.INTEGER, description: 'Chỉ số 0..3 cho multiple_choice' },
          subQuestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING, description: 'a, b, c hoặc d' },
                text: { type: Type.STRING },
                isCorrect: { type: Type.BOOLEAN },
                explanation: { type: Type.STRING, description: 'Giải thích chi tiết vì sao ý này Đúng hay Sai' },
              },
              required: ['label', 'text', 'isCorrect', 'explanation'],
            },
            description: '4 ý a,b,c,d cho câu true_false (mảng rỗng nếu không phải true_false)',
          },
          correctShortAnswer: { type: Type.STRING, description: 'Đáp số chuẩn cho short_answer' },
          acceptedAnswers: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Các cách viết đáp án được chấp nhận cho short_answer',
          },
          sampleSolution: { type: Type.STRING, description: 'Bài giải tự luận mẫu trình bày chi tiết từng bước' },
          rubric: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                step: { type: Type.STRING },
                points: { type: Type.NUMBER },
              },
              required: ['step', 'points'],
            },
          },
          explanation: {
            type: Type.STRING,
            description: 'Lời giải chi tiết từng bước (BẮT BUỘC đầy đủ, rõ ràng, dễ hiểu cho mọi dạng câu hỏi)',
          },
          points: { type: Type.NUMBER },
          level: {
            type: Type.STRING,
            description: 'Một trong: nhan_biet, thong_hieu, van_dung, van_dung_cao',
          },
          topic: {
            type: Type.STRING,
            description: 'Một trong: arithmetic, rational, algebra, equation, geometry, statistics',
          },
        },
        required: [
          'number',
          'section',
          'sectionTitle',
          'questionType',
          'questionText',
          'explanation',
          'points',
          'level',
          'topic',
        ],
      },
    },
  },
  required: ['title', 'description', 'matrix', 'questions'],
};

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));
  app.use((_req, res, next) => {
    res.setHeader('Permissions-Policy', 'camera=*, microphone=*');
    next();
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) });
  });

  // Direct download of the pre-formatted academic Word (.docx) essay
  app.get('/api/download-word-essay', async (_req, res) => {
    try {
      const buffer = await generateWordEssayBuffer({
        studentFullName: 'TRẦN THỊ DIỄM QUỲNH',
        fileName: 'Quynh.TranThiDiem.TOAN',
        softwareName: 'MATHQUEST THCS',
        chapterAndSubject: 'MÔN TOÁN CẤP TRUNG HỌC CƠ SỞ (KHỐI 6 - 9)',
        targetCompetency: 'TOÁN HỌC VÀ NĂNG LỰC SỐ CHO HỌC SINH',
        advisorName: 'PGS.TS LÊ THANH HUY',
        locationAndDate: 'ĐÀ NẴNG, 11/2026',
        onlineAppUrl: 'https://ais-pre-o5qlpvdy237xpaottrimr2-289569888306.asia-northeast1.run.app',
        youtubeUrl: '',
        screenshots: [],
      });
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="Quynh.TranThiDiem.TOAN.docx"'
      );
      return res.send(buffer);
    } catch (err: any) {
      console.error('Failed to generate Word essay:', err);
      return res.status(500).json({ error: 'Không thể tạo file Word lúc này.' });
    }
  });

  // POST /api/ai/generate-exam - Generate complete Math THCS exam + detailed step-by-step solutions without needing any document bank
  app.post('/api/ai/generate-exam', async (req, res) => {
    try {
      const {
        grade = 8,
        semester = 'HK1',
        examType = 'midterm',
        difficulty = 'standard',
        topicPrompt = '',
        customCounts,
      } = req.body || {};

      const validGrade = [6, 7, 8, 9].includes(Number(grade)) ? Number(grade) : 8;
      const validSemester = semester === 'HK2' ? 'HK2' : 'HK1';
      const validExamType = ['quiz_15m', 'midterm', 'final', 'custom'].includes(examType)
        ? examType
        : 'midterm';

      const { durationMinutes, structureInstructions, topicInstruction, difficultyLabel } =
        getExamStructurePrompt(validGrade, validSemester, validExamType, difficulty, topicPrompt, customCounts);

      const ai = createGeminiClient();

      const prompt = `
Bạn là giáo viên Toán THCS xuất sắc (Cô Diễm Quỳnh) biên soạn đề kiểm tra chuẩn Chương trình GDPT 2018 Việt Nam.
Hãy tự sáng tạo một đề kiểm tra Toán Lớp ${validGrade} (${validSemester === 'HK1' ? 'Học kỳ 1' : 'Học kỳ 2'}) HOÀN TOÀN MỚI (không cần kho tài liệu có sẵn).

${topicInstruction}
Mức độ phân hóa: ${difficultyLabel}

${structureInstructions}

QUY TẮC CHẤT LƯỢNG BẮT BUỘC:
1. Kiểm tra thật kỹ mọi phép tính toán học để đáp án ĐÚNG 100%, không sai sót, không mâu thuẫn đề bài.
2. MỌI câu hỏi (từ Trắc nghiệm, Đúng/Sai, Trả lời ngắn đến Tự luận) ĐỀU PHẢI CÓ mục "explanation" là LỜI GIẢI CHI TIẾT TỪNG BƯỚC rõ ràng, sư phạm, giúp học sinh tự học hiểu ngay cách làm.
3. Công thức toán viết gọn gàng dễ đọc (trong questionText/explanation dùng ký hiệu rõ ràng như x^2, √(x), phân số hoặc LaTeX chuẩn trong $...$ nếu cần; riêng trường "formula" chỉ để biểu thức LaTeX thuần KHÔNG có dấu $ bao quanh, hoặc chuỗi rỗng "" nếu không cần).
4. Với câu multiple_choice: đảm bảo options[correctAnswerIndex] khớp tuyệt đối với kết quả trong lời giải chi tiết.
5. Với câu true_false: đảm bảo đủ 4 ý a, b, c, d và mỗi ý có explanation riêng chỉ rõ đúng/sai vì sao.
6. Với câu essay: sampleSolution trình bày lời giải mẫu hoàn chỉnh từng bước xuống dòng rõ ràng, và rubric chia thang điểm hợp lý.
`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction:
            'Bạn là chuyên gia ra đề Toán THCS (lớp 6, 7, 8, 9) theo Chương trình GDPT 2018 Việt Nam. Luôn trả về JSON hợp lệ đúng schema, tính toán chính xác tuyệt đối và viết lời giải chi tiết sư phạm cho mọi câu hỏi.',
          responseMimeType: 'application/json',
          responseSchema: examResponseSchema,
          thinkingConfig: { thinkingLevel: ThinkingLevel.MEDIUM },
        },
      });

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        return res.status(502).json({ error: 'AI không trả về nội dung đề thi. Vui lòng thử lại.' });
      }

      const parsed = JSON.parse(rawText);
      const examId = `ai-exam-${Date.now()}`;
      const shortCode = `AI-K${validGrade}-${String(Date.now()).slice(-4)}`;

      const normalizedQuestions = (parsed.questions || []).map((q: any, idx: number) => {
        const qType = ['multiple_choice', 'true_false', 'short_answer', 'essay'].includes(q.questionType)
          ? q.questionType
          : 'multiple_choice';
        const qId = `${examId}-q${idx + 1}`;
        const sec = ['I', 'II', 'III', 'IV'].includes(q.section) ? q.section : 'I';
        const lvl = ['nhan_biet', 'thong_hieu', 'van_dung', 'van_dung_cao'].includes(q.level)
          ? q.level
          : 'thong_hieu';
        const tpc = ['arithmetic', 'rational', 'algebra', 'equation', 'geometry', 'statistics'].includes(q.topic)
          ? q.topic
          : 'algebra';

        const baseQuestion: any = {
          id: qId,
          number: q.number || idx + 1,
          section: sec,
          sectionTitle: q.sectionTitle || undefined,
          questionType: qType,
          questionText: q.questionText || '',
          formula: q.formula && String(q.formula).trim() ? String(q.formula).trim() : undefined,
          explanation: q.explanation || q.sampleSolution || 'Xem hướng dẫn giải chi tiết.',
          points: Number(q.points) || 0.5,
          level: lvl,
          topic: tpc,
        };

        if (qType === 'multiple_choice') {
          baseQuestion.options = Array.isArray(q.options) && q.options.length === 4 ? q.options : ['A', 'B', 'C', 'D'];
          baseQuestion.correctAnswerIndex =
            typeof q.correctAnswerIndex === 'number' && q.correctAnswerIndex >= 0 && q.correctAnswerIndex <= 3
              ? q.correctAnswerIndex
              : 0;
        } else if (qType === 'true_false') {
          const labels: ('a' | 'b' | 'c' | 'd')[] = ['a', 'b', 'c', 'd'];
          baseQuestion.subQuestions = (Array.isArray(q.subQuestions) ? q.subQuestions : []).slice(0, 4).map((sub: any, sIdx: number) => ({
            id: `${qId}-${labels[sIdx] || 'a'}`,
            label: labels[sIdx] || 'a',
            text: sub.text || '',
            isCorrect: Boolean(sub.isCorrect),
            explanation: sub.explanation || '',
          }));
        } else if (qType === 'short_answer') {
          baseQuestion.correctShortAnswer = String(q.correctShortAnswer ?? '').trim();
          baseQuestion.acceptedAnswers = Array.isArray(q.acceptedAnswers) && q.acceptedAnswers.length > 0
            ? q.acceptedAnswers.map((a: any) => String(a).trim())
            : [baseQuestion.correctShortAnswer];
        } else if (qType === 'essay') {
          baseQuestion.sampleSolution = q.sampleSolution || q.explanation || '';
          baseQuestion.rubric = Array.isArray(q.rubric) && q.rubric.length > 0
            ? q.rubric.map((r: any) => ({ step: String(r.step || ''), points: Number(r.points) || 0.25 }))
            : [{ step: 'Trình bày đúng phương pháp và kết quả chính xác', points: baseQuestion.points }];
        }

        return baseQuestion;
      });

      const exam = {
        id: examId,
        code: shortCode,
        title: parsed.title || `Đề Toán Lớp ${validGrade} (AI Tạo Tự Động)`,
        grade: validGrade,
        semester: validSemester,
        examType: validExamType === 'custom' ? 'midterm' : validExamType,
        durationMinutes,
        totalPoints: 10,
        description: parsed.description || `Đề kiểm tra Toán lớp ${validGrade} do AI biên soạn kèm lời giải chi tiết.`,
        matrix: parsed.matrix || { nhanBiet: 30, thongHieu: 30, vanDung: 30, vanDungCao: 10 },
        questions: normalizedQuestions,
        createdAt: new Date().toLocaleString('vi-VN'),
        isAIGenerated: true,
      };

      return res.json({ exam });
    } catch (err: any) {
      console.error('Error generating AI exam:', err);
      if (err?.message === 'MISSING_API_KEY') {
        return res.status(500).json({
          error: 'Chưa cấu hình GEMINI_API_KEY trên máy chủ. Vui lòng kiểm tra mục Settings > Secrets.',
        });
      }
      const status = err?.status || err?.code;
      if (status === 403 || status === 400) {
        return res.status(400).json({
          error: 'Khóa API Gemini không hợp lệ hoặc bị từ chối quyền. Vui lòng kiểm tra lại trong Settings > Secrets.',
        });
      }
      if (status === 429) {
        return res.status(429).json({
          error: 'Hệ thống AI đang quá tải hoặc vượt hạn mức tạm thời. Vui lòng thử lại sau ít phút.',
        });
      }
      return res.status(500).json({
        error: `Không thể tạo đề AI lúc này: ${err?.message || 'Lỗi máy chủ không xác định'}`,
      });
    }
  });

  // POST /api/ai/explain-question - Deep step-by-step pedagogical explanation for any question
  app.post('/api/ai/explain-question', async (req, res) => {
    try {
      const { questionText, formula, options, grade = 8, currentExplanation } = req.body || {};
      if (!questionText) {
        return res.status(400).json({ error: 'Thiếu nội dung câu hỏi cần giải thích.' });
      }

      const ai = createGeminiClient();
      const prompt = `
Bạn là Cô Diễm Quỳnh - Giáo viên Toán THCS (Lớp ${grade}). Hãy viết một hướng dẫn GIẢI CHI TIẾT SƯ PHẠM cho bài toán sau để học sinh yếu/trung bình cũng hiểu tường tận:

Đề bài: ${questionText}
${formula ? `Công thức: ${formula}` : ''}
${Array.isArray(options) && options.length > 0 ? `Các phương án: ${options.map((o: string, i: number) => `${String.fromCharCode(65 + i)}. ${o}`).join(' | ')}` : ''}
${currentExplanation ? `Gợi ý ban đầu: ${currentExplanation}` : ''}

Hãy trình bày ngắn gọn, mạch lạc gồm 4 mục:
1. 📌 Kiến thức / Công thức áp dụng
2. ✏️ Các bước giải chi tiết (từng bước 1, 2, 3...)
3. ⚠️ Lỗi sai học sinh thường gặp cần tránh
4. 💡 Mẹo làm nhanh (nếu có)
`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      return res.json({ detailedExplanation: (response.text ?? '').trim() });
    } catch (err: any) {
      console.error('Error explaining question:', err);
      return res.status(500).json({
        error: err?.message === 'MISSING_API_KEY'
          ? 'Chưa cấu hình GEMINI_API_KEY trong Settings > Secrets.'
          : `Không thể tạo phân tích chi tiết: ${err?.message || 'Lỗi không xác định'}`,
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MathQuest THCS server running on http://localhost:${PORT} (network: http://0.0.0.0:${PORT})`);
  });
}

startServer();
