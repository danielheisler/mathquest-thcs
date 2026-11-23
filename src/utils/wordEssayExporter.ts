import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  PageBreak,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  convertMillimetersToTwip,
  LineRuleType,
  ImageRun,
  ExternalHyperlink,
  HeadingLevel,
  PageOrientation,
} from 'docx';

export interface EssayScreenshotItem {
  stepKey: string;
  caption: string;
  dataUrl: string | null;
  width?: number;
  height?: number;
}

export interface WordEssayConfig {
  studentFullName: string;
  fileName: string; // e.g. Quynh.TranThiDiem.TOAN
  softwareName: string;
  chapterAndSubject: string;
  targetCompetency: string;
  advisorName: string;
  locationAndDate: string;
  onlineAppUrl: string;
  youtubeUrl: string;
  screenshots: EssayScreenshotItem[];
}

const FONT_NAME = 'Times New Roman';
const BODY_SIZE = 24; // 12pt = 24 half-points
const SINGLE_LINE = 240; // Line spacing 1.0 (single)

const BLACK_BORDER = {
  style: BorderStyle.SINGLE,
  size: 4,
  color: '000000',
};

const CELL_BORDERS = {
  top: BLACK_BORDER,
  bottom: BLACK_BORDER,
  left: BLACK_BORDER,
  right: BLACK_BORDER,
};

function bodyParagraph(
  text: string,
  options?: {
    bold?: boolean;
    italics?: boolean;
    indentFirstLine?: boolean;
    spaceAfter?: number;
    spaceBefore?: number;
    alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
  }
): Paragraph {
  return new Paragraph({
    alignment: options?.alignment ?? AlignmentType.JUSTIFIED,
    indent: options?.indentFirstLine ? { firstLine: convertMillimetersToTwip(10) } : undefined,
    spacing: {
      line: SINGLE_LINE,
      lineRule: LineRuleType.AUTO,
      before: options?.spaceBefore ?? 40,
      after: options?.spaceAfter ?? 80,
    },
    children: [
      new TextRun({
        text,
        font: FONT_NAME,
        size: BODY_SIZE,
        bold: options?.bold ?? false,
        italics: options?.italics ?? false,
        color: '000000',
      }),
    ],
  });
}

function labeledParagraph(label: string, content: string, indentFirstLine = true): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: indentFirstLine ? { firstLine: convertMillimetersToTwip(10) } : undefined,
    spacing: {
      line: SINGLE_LINE,
      lineRule: LineRuleType.AUTO,
      before: 40,
      after: 80,
    },
    children: [
      new TextRun({
        text: label,
        font: FONT_NAME,
        size: BODY_SIZE,
        bold: true,
        color: '000000',
      }),
      new TextRun({
        text: content,
        font: FONT_NAME,
        size: BODY_SIZE,
        color: '000000',
      }),
    ],
  });
}

function bulletParagraph(label: string, content: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: {
      left: convertMillimetersToTwip(12),
      hanging: convertMillimetersToTwip(5),
    },
    spacing: {
      line: SINGLE_LINE,
      lineRule: LineRuleType.AUTO,
      before: 30,
      after: 60,
    },
    children: [
      new TextRun({
        text: '- ',
        font: FONT_NAME,
        size: BODY_SIZE,
        bold: true,
        color: '000000',
      }),
      ...(label
        ? [
            new TextRun({
              text: label,
              font: FONT_NAME,
              size: BODY_SIZE,
              bold: true,
              color: '000000',
            }),
          ]
        : []),
      new TextRun({
        text: content,
        font: FONT_NAME,
        size: BODY_SIZE,
        color: '000000',
      }),
    ],
  });
}

function sectionHeading(text: string, italicSubtitle?: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.LEFT,
    spacing: {
      line: SINGLE_LINE,
      lineRule: LineRuleType.AUTO,
      before: 180,
      after: 100,
    },
    children: [
      new TextRun({
        text,
        font: FONT_NAME,
        size: BODY_SIZE,
        bold: true,
        color: '000000',
      }),
      ...(italicSubtitle
        ? [
            new TextRun({
              text: ` ${italicSubtitle}`,
              font: FONT_NAME,
              size: BODY_SIZE,
              bold: true,
              italics: true,
              color: '000000',
            }),
          ]
        : []),
    ],
  });
}

function subHeading(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    alignment: AlignmentType.LEFT,
    spacing: {
      line: SINGLE_LINE,
      lineRule: LineRuleType.AUTO,
      before: 140,
      after: 80,
    },
    children: [
      new TextRun({
        text,
        font: FONT_NAME,
        size: BODY_SIZE,
        bold: true,
        color: '000000',
      }),
    ],
  });
}

function makeTableCell(
  lines: { text: string; bold?: boolean; italics?: boolean; align?: (typeof AlignmentType)[keyof typeof AlignmentType] }[],
  widthPct?: number
): TableCell {
  return new TableCell({
    width: widthPct ? { size: widthPct, type: WidthType.PERCENTAGE } : undefined,
    borders: CELL_BORDERS,
    margins: {
      top: 80,
      bottom: 80,
      left: 110,
      right: 110,
    },
    children: lines.map(
      item =>
        new Paragraph({
          alignment: item.align ?? AlignmentType.LEFT,
          spacing: { line: SINGLE_LINE, lineRule: LineRuleType.AUTO, before: 20, after: 40 },
          children: [
            new TextRun({
              text: item.text,
              font: FONT_NAME,
              size: BODY_SIZE,
              bold: item.bold ?? false,
              italics: item.italics ?? false,
              color: '000000',
            }),
          ],
        })
    ),
  });
}

function dataUrlToUint8Array(dataUrl: string): Uint8Array | null {
  try {
    const base64 = dataUrl.split(',')[1];
    if (!base64) return null;
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

function getImageTypeFromDataUrl(dataUrl: string): 'png' | 'jpg' | 'gif' | 'bmp' {
  if (dataUrl.startsWith('data:image/jpeg') || dataUrl.startsWith('data:image/jpg')) return 'jpg';
  if (dataUrl.startsWith('data:image/gif')) return 'gif';
  if (dataUrl.startsWith('data:image/bmp')) return 'bmp';
  return 'png';
}

function buildScreenshotBlock(shot: EssayScreenshotItem | undefined, fallbackCaption: string): (Paragraph | Table)[] {
  const captionText = shot?.caption || fallbackCaption;
  if (shot?.dataUrl) {
    const bytes = dataUrlToUint8Array(shot.dataUrl);
    if (bytes) {
      const targetWidth = 520;
      const ratio = shot.width && shot.height ? shot.height / shot.width : 0.56;
      const targetHeight = Math.round(Math.min(360, Math.max(180, targetWidth * ratio)));
      return [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100, after: 60 },
          children: [
            new ImageRun({
              data: bytes,
              type: getImageTypeFromDataUrl(shot.dataUrl),
              transformation: {
                width: targetWidth,
                height: targetHeight,
              },
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: SINGLE_LINE, lineRule: LineRuleType.AUTO, before: 20, after: 120 },
          children: [
            new TextRun({
              text: captionText,
              font: FONT_NAME,
              size: BODY_SIZE,
              italics: true,
              color: '000000',
            }),
          ],
        }),
      ];
    }
  }

  // Clean B&W printable placeholder box ready for pasting screenshots in Word
  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              borders: {
                top: { style: BorderStyle.DASHED, size: 6, color: '000000' },
                bottom: { style: BorderStyle.DASHED, size: 6, color: '000000' },
                left: { style: BorderStyle.DASHED, size: 6, color: '000000' },
                right: { style: BorderStyle.DASHED, size: 6, color: '000000' },
              },
              margins: { top: 260, bottom: 260, left: 200, right: 200 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { line: SINGLE_LINE, lineRule: LineRuleType.AUTO },
                  children: [
                    new TextRun({
                      text: `[CHÈN ẢNH CHỤP MÀN HÌNH MINH HỌA TẠI ĐÂY - ${captionText}]`,
                      font: FONT_NAME,
                      size: BODY_SIZE,
                      italics: true,
                      color: '000000',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: SINGLE_LINE, lineRule: LineRuleType.AUTO, before: 60, after: 120 },
      children: [
        new TextRun({
          text: captionText,
          font: FONT_NAME,
          size: BODY_SIZE,
          italics: true,
          color: '000000',
        }),
      ],
    }),
  ];
}

export function buildWordEssayDocument(config: WordEssayConfig): Document {
  const findShot = (key: string) => config.screenshots.find(s => s.stepKey === key);

  // =========================================================================
  // PAGE 1: TRANG BÌA (Exact layout per Image 2)
  // =========================================================================
  const coverPageChildren: (Paragraph | Table)[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: SINGLE_LINE, lineRule: LineRuleType.AUTO, before: 120, after: 60 },
      children: [
        new TextRun({
          text: 'ĐẠI HỌC ĐÀ NẴNG',
          font: FONT_NAME,
          size: 26, // 13pt
          bold: true,
          color: '000000',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: SINGLE_LINE, lineRule: LineRuleType.AUTO, before: 40, after: 480 },
      children: [
        new TextRun({
          text: 'TRƯỜNG ĐẠI HỌC SƯ PHẠM',
          font: FONT_NAME,
          size: 26, // 13pt
          bold: true,
          color: '000000',
        }),
      ],
    }),

    // Student Name
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: SINGLE_LINE, lineRule: LineRuleType.AUTO, before: 360, after: 640 },
      children: [
        new TextRun({
          text: config.studentFullName.trim().toUpperCase() || 'TRẦN THỊ DIỄM QUỲNH',
          font: FONT_NAME,
          size: 26, // 13pt
          bold: true,
          color: '000000',
        }),
      ],
    }),

    // Title: TIỂU LUẬN
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: SINGLE_LINE, lineRule: LineRuleType.AUTO, before: 360, after: 200 },
      children: [
        new TextRun({
          text: 'TIỂU LUẬN',
          font: FONT_NAME,
          size: 32, // 16pt
          bold: true,
          color: '000000',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 280, lineRule: LineRuleType.AUTO, before: 60, after: 80 },
      children: [
        new TextRun({
          text: `THIẾT KẾ PHẦN MỀM/ WEBSITE (${config.softwareName.trim().toUpperCase()})`,
          font: FONT_NAME,
          size: 28, // 14pt
          bold: true,
          color: '000000',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 280, lineRule: LineRuleType.AUTO, before: 60, after: 80 },
      children: [
        new TextRun({
          text: `TRONG DẠY HỌC ${config.chapterAndSubject.trim().toUpperCase()}`,
          font: FONT_NAME,
          size: 28, // 14pt
          bold: true,
          color: '000000',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 280, lineRule: LineRuleType.AUTO, before: 60, after: 560 },
      children: [
        new TextRun({
          text: `NHẰM PHÁT TRIỂN NĂNG LỰC ${config.targetCompetency.trim().toUpperCase()}`,
          font: FONT_NAME,
          size: 28, // 14pt
          bold: true,
          color: '000000',
        }),
      ],
    }),

    // Advisor
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: SINGLE_LINE, lineRule: LineRuleType.AUTO, before: 360, after: 1800 },
      children: [
        new TextRun({
          text: `Hướng dẫn khoa học: ${config.advisorName.trim() || 'PGS.TS LÊ THANH HUY'}`,
          font: FONT_NAME,
          size: 26, // 13pt
          bold: true,
          color: '000000',
        }),
      ],
    }),

    // Location & Date at bottom
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: SINGLE_LINE, lineRule: LineRuleType.AUTO, before: 1200, after: 0 },
      children: [
        new TextRun({
          text: config.locationAndDate.trim().toUpperCase() || 'ĐÀ NẴNG, 11/2026',
          font: FONT_NAME,
          size: 26, // 13pt
          bold: true,
          color: '000000',
        }),
      ],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];

  // =========================================================================
  // PAGE 2: MỤC LỤC (Exact layout per Image 3)
  // =========================================================================
  const tocItems: { title: string; page: string; bold?: boolean; indent?: number }[] = [
    { title: '1. LÝ DO TẠO HỌC LIỆU SỐ', page: '3', bold: true },
    { title: '2. MỤC TIÊU', page: '4', bold: true },
    { title: '2.1. Mục tiêu chung', page: '4', indent: 8 },
    { title: '2.2. Mục tiêu cụ thể đối với học sinh, giáo viên và phụ huynh', page: '4', indent: 8 },
    { title: '3. CƠ SỞ LÝ LUẬN', page: '5', bold: true },
    { title: '3.1. Cơ sở pháp lý và định hướng Chương trình GDPT 2018 môn Toán', page: '5', indent: 8 },
    { title: '3.2. Lý thuyết dạy học tích cực, học tập đa phương tiện và trò chơi hóa (Gamification)', page: '5', indent: 8 },
    { title: '3.3. Ứng dụng Trí tuệ nhân tạo (AI) trong cá nhân hóa và kiểm tra đánh giá môn Toán', page: '6', indent: 8 },
    { title: '4. GIỚI THIỆU CHỨC NĂNG (GIỚI THIỆU TÓM TẮT CÁC CHỨC NĂNG CHÍNH)', page: '7', bold: true },
    { title: '4.1. Link liên kết tới học liệu số online', page: '7', indent: 8 },
    { title: '4.2. Sơ đồ chức năng tổng thể của hệ thống MathQuest THCS', page: '7', indent: 8 },
    { title: '4.3. Tóm tắt các nhóm chức năng chính theo 3 không gian người dùng', page: '8', indent: 8 },
    { title: '5. HƯỚNG DẪN VÀ PHÂN TÍCH CÁCH THỨC SỬ DỤNG CHI TIẾT', page: '9', bold: true },
    { title: '5.1. Quy trình chung các bước sử dụng phần mềm', page: '9', indent: 8 },
    { title: '5.2. Trình bày chi tiết các bước sử dụng (kèm hình ảnh minh họa)', page: '10', indent: 8 },
    { title: '5.3. Phân tích cơ sở sư phạm: Vì sao sử dụng như vậy và để làm gì?', page: '13', indent: 8 },
    { title: '5.4. Video hướng dẫn chi tiết trên YouTube', page: '15', indent: 8 },
    { title: 'TÀI LIỆU THAM KHẢO', page: '16', bold: true },
  ];

  const tocChildren: (Paragraph | Table)[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: SINGLE_LINE, lineRule: LineRuleType.AUTO, before: 120, after: 260 },
      children: [
        new TextRun({
          text: 'MỤC LỤC',
          font: FONT_NAME,
          size: 28, // 14pt
          bold: true,
          color: '000000',
        }),
      ],
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: tocItems.map(
        item =>
          new TableRow({
            children: [
              new TableCell({
                width: { size: 88, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                  bottom: { style: BorderStyle.DOTTED, size: 2, color: '666666' },
                  left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                  right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                },
                margins: { top: 40, bottom: 40, left: item.indent ? item.indent * 40 : 0, right: 60 },
                children: [
                  new Paragraph({
                    spacing: { line: SINGLE_LINE, lineRule: LineRuleType.AUTO },
                    children: [
                      new TextRun({
                        text: item.title,
                        font: FONT_NAME,
                        size: BODY_SIZE,
                        bold: item.bold ?? false,
                        color: '000000',
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 12, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                  bottom: { style: BorderStyle.DOTTED, size: 2, color: '666666' },
                  left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                  right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                },
                margins: { top: 40, bottom: 40, left: 40, right: 0 },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    spacing: { line: SINGLE_LINE, lineRule: LineRuleType.AUTO },
                    children: [
                      new TextRun({
                        text: item.page,
                        font: FONT_NAME,
                        size: BODY_SIZE,
                        bold: item.bold ?? false,
                        color: '000000',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
      ),
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { line: SINGLE_LINE, lineRule: LineRuleType.AUTO, before: 200, after: 0 },
      children: [
        new TextRun({
          text: '(Ghi chú: Sau khi chèn hình ảnh chụp màn hình vào Mục 5.2, học viên có thể điều chỉnh lại số trang tương ứng trong bảng Mục lục trên cho khớp thực tế trước khi in ấn).',
          font: FONT_NAME,
          size: 22,
          italics: true,
          color: '000000',
        }),
      ],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];

  // =========================================================================
  // MAIN CONTENT: NỘI DUNG (Exact 5-section structure per Image 4)
  // =========================================================================
  const contentChildren: (Paragraph | Table)[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: SINGLE_LINE, lineRule: LineRuleType.AUTO, before: 60, after: 200 },
      children: [
        new TextRun({
          text: 'NỘI DUNG',
          font: FONT_NAME,
          size: 28,
          bold: true,
          color: '000000',
        }),
      ],
    }),

    // ------------------- SECTION 1 -------------------
    sectionHeading('1. LÝ DO TẠO HỌC LIỆU SỐ'),
    bodyParagraph(
      'Trong bối cảnh chuyển đổi số mạnh mẽ của ngành giáo dục và việc triển khai đồng bộ Chương trình Giáo dục phổ thông 2018 (GDPT 2018), môn Toán cấp Trung học cơ sở (THCS) giữ vai trò nền tảng trong việc hình thành tư duy logic, năng lực giải quyết vấn đề và năng lực mô hình hóa toán học cho học sinh. Tuy nhiên, thực tiễn dạy học và kiểm tra đánh giá môn Toán ở bậc THCS hiện nay vẫn đang tồn tại nhiều thách thức đáng kể cần được tháo gỡ bằng các giải pháp học liệu số chuyên biệt:',
      { indentFirstLine: true }
    ),
    bulletParagraph(
      'Thứ nhất, áp lực biên soạn đề kiểm tra theo cấu trúc mới và giải chi tiết: ',
      'Theo định hướng đánh giá năng lực mới (kết hợp trắc nghiệm nhiều lựa chọn ABCD, trắc nghiệm Đúng/Sai 4 ý, trả lời ngắn và tự luận), giáo viên bộ môn Toán mất rất nhiều thời gian để xây dựng ma trận, biên soạn đề 15 phút, giữa kỳ, cuối kỳ và viết hướng dẫn giải chi tiết kèm biểu điểm cho từng khối lớp 6, 7, 8, 9. Khi cần tạo đề luyện tập nhanh hoặc đề kiểm tra bổ sung mà không có sẵn kho đề chuẩn hóa, giáo viên gặp nhiều khó khăn.'
    ),
    bulletParagraph(
      'Thứ hai, sự thiếu hụt hứng thú và tính tương tác trong luyện tập Toán học: ',
      'Nhiều học sinh THCS cảm thấy môn Toán khô khan, dễ chán nản khi chỉ làm bài tập trên giấy một chiều mà không nhận được phản hồi tức thời hoặc lời giải thích từng bước khi làm sai. Việc lồng ghép trò chơi hóa (Gamification), vận động tương tác qua Camera và đấu trí AI sẽ giúp học sinh chủ động tham gia và ghi nhớ kiến thức sâu sắc hơn.'
    ),
    bulletParagraph(
      'Thứ ba, bài toán đảm bảo tính trung thực khi làm bài trực tuyến và kết nối gia đình – nhà trường: ',
      'Khi giao bài tập về nhà hoặc luyện đề trực tuyến, giáo viên khó kiểm soát giờ vào làm bài, giờ nộp bài cũng như hành vi chuyển tab tra cứu đáp án của học sinh. Đồng thời, phụ huynh thường thiếu một kênh riêng tư, an toàn để theo dõi sát tiến độ học tập, điểm số và nhận xét chuyên môn từ giáo viên bộ môn và giáo viên chủ nhiệm.'
    ),
    bodyParagraph(
      'Xuất phát từ những yêu cầu thực tiễn cấp thiết đó, tôi đã nghiên cứu và thiết kế học liệu số dạng phần mềm Web tương tác mang tên MathQuest THCS (phục vụ giảng dạy Toán Khối 6–9 và công tác chủ nhiệm lớp), tích hợp công nghệ Trí tuệ nhân tạo (AI) tạo đề thi kèm giải chi tiết mọi lúc, hệ thống trò chơi học tập trực quan, cơ chế giám sát trung thực thời gian thực và phân quyền bảo mật riêng biệt cho Học sinh – Phụ huynh – Giáo viên.',
      { indentFirstLine: true }
    ),

    // ------------------- SECTION 2 -------------------
    sectionHeading('2. MỤC TIÊU'),
    subHeading('2.1. Mục tiêu chung'),
    bodyParagraph(
      'Xây dựng một hệ sinh thái học liệu số trực tuyến toàn diện (MathQuest THCS) phục vụ dạy học, luyện tập, kiểm tra đánh giá và quản lý lớp học môn Toán THCS (lớp 6, 7, 8, 9) theo Chương trình GDPT 2018, góp phần phát triển đồng thời năng lực toán học và năng lực số cho học sinh, đồng thời giảm tải công việc hành chính – soạn đề cho giáo viên.',
      { indentFirstLine: true }
    ),
    subHeading('2.2. Mục tiêu cụ thể'),
    bulletParagraph(
      'Đối với học sinh: ',
      'Tạo môi trường tự học sinh động qua 5 trò chơi Toán học, trò chơi vận động cơ thể nhận diện qua Camera (có chế độ dự phòng không cần Camera), phòng thực hành trực quan và đấu trí AI MathBot; giúp học sinh luyện tập đúng chuẩn cấu trúc đề kiểm tra 15 phút, giữa kỳ, cuối kỳ và tự đối chiếu mục Giải Chi Tiết từng bước để khắc phục lỗ hổng kiến thức.'
    ),
    bulletParagraph(
      'Đối với giáo viên bộ môn Toán và giáo viên chủ nhiệm: ',
      'Trang bị công cụ Tạo Đề AI trực tiếp (không cần kho tài liệu sẵn) theo đúng cấu trúc yêu cầu (Đề giữa kỳ/cuối kỳ: 12 câu trắc nghiệm 4 đáp án ABCD + 1 câu Đúng/Sai 4 ý + 2 câu trả lời ngắn + 5 câu tự luận; Đề 15 phút: 4 câu trắc nghiệm 4 điểm + 2 câu tự luận 6 điểm) kèm lời giải chi tiết, biểu điểm và in ấn A4; tự động thống kê báo cáo tuần trực quan, rà soát giờ vào – giờ ra, phát chuông cảnh báo khi học sinh chuyển tab; hỗ trợ nhập danh sách lớp từ Excel, quản lý sơ đồ chỗ ngồi 4 dãy/4 tổ và sổ điểm điện tử VnEdu.'
    ),
    bulletParagraph(
      'Đối với phụ huynh học sinh: ',
      'Cung cấp "Góc Phụ Huynh" độc lập, bảo mật bằng mã PIN riêng do giáo viên cấp kín, giúp phụ huynh tra cứu nhanh bảng điểm, tỷ lệ chuyên cần, lịch sử hoàn thành bài tập về nhà và nhận lời khuyên đồng hành học tập từ giáo viên.'
    ),

    // ------------------- SECTION 3 -------------------
    sectionHeading('3. CƠ SỞ LÝ LUẬN'),
    subHeading('3.1. Cơ sở pháp lý và định hướng Chương trình GDPT 2018 môn Toán'),
    bodyParagraph(
      'Chương trình GDPT môn Toán (ban hành kèm Thông tư số 32/2018/TT-BGDĐT ngày 26/12/2018) xác định 05 thành phần cốt lõi của năng lực toán học gồm: (1) Năng lực tư duy và lập luận toán học; (2) Năng lực mô hình hóa toán học; (3) Năng lực giải quyết vấn đề toán học; (4) Năng lực giao tiếp toán học; và (5) Năng lực sử dụng công cụ, phương tiện học toán. Bên cạnh đó, Thông tư 22/2021/TT-BGDĐT quy định về đánh giá học sinh THCS nhấn mạnh việc kết hợp đánh giá thường xuyên (kiểm tra miệng, 15 phút, sản phẩm học tập) với đánh giá định kỳ (giữa kỳ, cuối kỳ) nhằm mục tiêu vì sự tiến bộ của người học.',
      { indentFirstLine: true }
    ),
    bodyParagraph(
      'Song song với đó, Quyết định số 131/QĐ-TTg của Thủ tướng Chính phủ phê duyệt Đề án "Tăng cường ứng dụng công nghệ thông tin và chuyển đổi số trong giáo dục và đào tạo giai đoạn 2022–2025, định hướng đến năm 2030" khẳng định việc xây dựng học liệu số mở, tích hợp kiểm tra đánh giá trực tuyến và ứng dụng trí tuệ nhân tạo là hướng đi tất yếu để nâng cao chất lượng giáo dục phổ thông.',
      { indentFirstLine: true }
    ),
    subHeading('3.2. Lý thuyết học tập đa phương tiện, kiến tạo và trò chơi hóa (Gamification)'),
    bodyParagraph(
      'Theo Lý thuyết nhận thức về học tập đa phương tiện của Richard E. Mayer (2009), người học tiếp thu kiến thức hiệu quả hơn nhiều khi thông tin được trình bày kết hợp giữa kênh ngôn ngữ (lời giải, công thức ký hiệu Toán học chuẩn KaTeX/MathType) và kênh hình ảnh trực quan (biểu đồ thống kê, mô phỏng đồ thị, hình học tương tác). Ngoài ra, tiếp cận trò chơi hóa (Gamification in Education – Kapp, 2012) thông qua cơ chế điểm thưởng, bảng xếp hạng, huy hiệu và thử thách có thời gian giúp kích thích động lực nội tại, biến quá trình luyện tập Toán học trở thành trải nghiệm tích cực.',
      { indentFirstLine: true }
    ),
    subHeading('3.3. Ứng dụng Trí tuệ nhân tạo (AI) trong thiết kế học liệu và đánh giá năng lực'),
    bodyParagraph(
      'Sự phát triển của các mô hình ngôn ngữ lớn (Large Language Models) và trí tuệ nhân tạo tạo sinh (Generative AI) cho phép sinh đề thi động theo ma trận nhận thức 4 mức độ (Nhận biết – Thông hiểu – Vận dụng – Vận dụng cao) dựa trên thang phân loại Bloom cải tiến mà không bị giới hạn bởi ngân hàng đề tĩnh. Khi AI đồng thời sinh lời giải sư phạm từng bước, chỉ ra lỗi sai thường gặp và biểu điểm chấm tự luận, học sinh được hỗ trợ theo đúng lý thuyết "Vùng phát triển gần" (Zone of Proximal Development) của L.S. Vygotsky – có thể tự giải quyết các nhiệm vụ khó hơn nhờ hệ thống giàn giáo (scaffolding) kịp thời.',
      { indentFirstLine: true }
    ),

    // ------------------- SECTION 4 -------------------
    sectionHeading('4. GIỚI THIỆU CHỨC NĂNG', '(GIỚI THIỆU TÓM TẮT CÁC CHỨC NĂNG CHÍNH)'),
    subHeading('4.1. Link liên kết tới học liệu số online'),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      indent: { firstLine: convertMillimetersToTwip(10) },
      spacing: { line: SINGLE_LINE, lineRule: LineRuleType.AUTO, before: 40, after: 100 },
      children: [
        new TextRun({
          text: 'Địa chỉ truy cập trực tuyến học liệu số MathQuest THCS: ',
          font: FONT_NAME,
          size: BODY_SIZE,
          bold: true,
          color: '000000',
        }),
        new ExternalHyperlink({
          link: config.onlineAppUrl.trim(),
          children: [
            new TextRun({
              text: config.onlineAppUrl.trim(),
              font: FONT_NAME,
              size: BODY_SIZE,
              underline: {},
              color: '000000',
            }),
          ],
        }),
      ],
    }),
    bodyParagraph(
      'Học liệu hoạt động trực tiếp trên trình duyệt web của máy tính, máy tính bảng và điện thoại thông minh (tối ưu iOS/Android), hỗ trợ chế độ toàn màn hình trình chiếu trên lớp và lưu trữ dữ liệu cục bộ để hoạt động ổn định.',
      { indentFirstLine: true }
    ),

    subHeading('4.2. Sơ đồ chức năng tổng thể của phần mềm MathQuest THCS'),
    bodyParagraph(
      'Hệ thống được kiến trúc theo mô hình 03 phân khu chức năng tách biệt, bảo mật bằng cơ chế mã PIN riêng biệt như Sơ đồ 1 dưới đây:',
      { indentFirstLine: true }
    ),

    // SƠ ĐỒ CHỨC NĂNG (Clean B&W Structured Diagram Table)
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 3,
              borders: CELL_BORDERS,
              margins: { top: 100, bottom: 100, left: 120, right: 120 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { line: SINGLE_LINE, lineRule: LineRuleType.AUTO },
                  children: [
                    new TextRun({
                      text: 'HỆ THỐNG HỌC LIỆU SỐ MÔN TOÁN THCS — MATHQUEST THCS (KHỐI 6 - 9)',
                      font: FONT_NAME,
                      size: BODY_SIZE,
                      bold: true,
                      color: '000000',
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { line: SINGLE_LINE, lineRule: LineRuleType.AUTO },
                  children: [
                    new TextRun({
                      text: '(Phụ trách bộ môn Toán & Chủ nhiệm: Cô Diễm Quỳnh)',
                      font: FONT_NAME,
                      size: BODY_SIZE,
                      italics: true,
                      color: '000000',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            makeTableCell(
              [
                { text: '1. GÓC HỌC SINH', bold: true, align: AlignmentType.CENTER },
                { text: '(Truy cập tự do học tập)', italics: true, align: AlignmentType.CENTER },
              ],
              34
            ),
            makeTableCell(
              [
                { text: '2. GÓC PHỤ HUYNH', bold: true, align: AlignmentType.CENTER },
                { text: '(Khóa bảo mật bằng Mã PIN riêng)', italics: true, align: AlignmentType.CENTER },
              ],
              32
            ),
            makeTableCell(
              [
                { text: '3. GÓC GIÁO VIÊN', bold: true, align: AlignmentType.CENTER },
                { text: '(Khóa bảo mật bằng Mã PIN riêng)', italics: true, align: AlignmentType.CENTER },
              ],
              34
            ),
          ],
        }),
        new TableRow({
          children: [
            makeTableCell(
              [
                { text: '• Trò chơi Toán học (5 game tương tác)' },
                { text: '• Vận động cơ thể qua Camera (kèm nút chọn dự phòng khi không có Camera)' },
                { text: '• Tạo trò chơi theo yêu cầu (Studio)' },
                { text: '• Luyện đề 15p, Giữa kỳ & Cuối kỳ (tự động lưu bài đang làm dở)' },
                { text: '• Tạo Đề AI & Giải Chi Tiết từng bước (không cần kho đề sẵn)' },
                { text: '• Làm Bài tập về nhà (BTVN) theo nhánh Đại số / Hình học / Thống kê' },
                { text: '• Đấu trí AI MathBot & Bài giảng trực quan' },
              ],
              34
            ),
            makeTableCell(
              [
                { text: '• Xác thực mã PIN riêng do GV gửi kín qua tin nhắn/Zalo (không hiển thị công khai)' },
                { text: '• Tra cứu học tập theo Số điện thoại phụ huynh hoặc tên học sinh' },
                { text: '• Xem bảng điểm trung bình, độ chính xác và xếp hạng trong lớp' },
                { text: '• Theo dõi lịch sử làm BTVN: giờ vào, giờ nộp, mức độ trung thực' },
                { text: '• Đọc nhận xét chuyên môn và lời khuyên đồng hành từ Cô Diễm Quỳnh' },
              ],
              32
            ),
            makeTableCell(
              [
                { text: '[A] GV Bộ Môn Toán:' },
                { text: '• Tạo Đề AI trực tiếp & Giải Chi Tiết + In Đề / In Đáp án A4' },
                { text: '• Quản lý lớp học, chỉnh sửa nhiệm vụ trực tiếp, nhập danh sách Excel (.xlsx/.csv)' },
                { text: '• Radar chống chuyển tab (phát chuông cảnh báo tại máy GV)' },
                { text: '• Giám sát BTVN: cột giờ vào – giờ ra, gửi SMS/Zalo nhắc PH' },
                { text: '• Ngân hàng câu hỏi MathType & Báo cáo thống kê tuần / PDF' },
                { text: '[B] GV Chủ Nhiệm:' },
                { text: '• Sơ đồ chỗ ngồi lớp học (4 Dãy / 4 Tổ)' },
                { text: '• Sổ điểm điện tử VnEdu đa môn & Cài đặt đổi mã PIN kín' },
              ],
              34
            ),
          ],
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: SINGLE_LINE, lineRule: LineRuleType.AUTO, before: 60, after: 120 },
      children: [
        new TextRun({
          text: 'Sơ đồ 1. Sơ đồ kiến trúc chức năng tổng thể của học liệu số MathQuest THCS.',
          font: FONT_NAME,
          size: BODY_SIZE,
          italics: true,
          color: '000000',
        }),
      ],
    }),

    subHeading('4.3. Tóm tắt các chức năng nổi bật của học liệu số'),
    bulletParagraph(
      'Chức năng Tạo Đề AI mọi lúc (không cần kho tài liệu) kèm mục Giải Chi Tiết: ',
      'Ứng dụng mô hình trí tuệ nhân tạo tạo sinh phía máy chủ để biên soạn đề thi Toán hoàn toàn mới cho các khối 6, 7, 8, 9 đúng chuẩn cấu trúc: Đề Giữa kỳ / Cuối kỳ gồm 12 câu trắc nghiệm 4 đáp án ABCD (3,0đ) + 1 câu Đúng/Sai 4 ý a, b, c, d (1,0đ) + 2 câu trả lời ngắn (1,0đ) + 5 câu tự luận (5,0đ); Đề kiểm tra 15 phút gồm 4 câu trắc nghiệm (4,0đ) + 2 câu tự luận (6,0đ). Mỗi câu đều đi kèm lời giải chi tiết từng bước, biểu điểm tự luận và tính năng AI phân tích sư phạm sâu 4 bước (Kiến thức áp dụng – Các bước giải – Lỗi sai thường gặp – Mẹo làm nhanh).'
    ),
    bulletParagraph(
      'Chức năng Kiểm tra trực tuyến bảo toàn tiến trình và giám sát chống chuyển tab: ',
      'Hệ thống tự động lưu trạng thái bài làm vào bộ nhớ trình duyệt (LocalStorage), hiển thị thanh thông báo quay lại bài đang làm dở nếu học sinh lỡ chuyển trang. Đồng thời ghi nhận chính xác giờ vào làm bài, giờ nộp bài và phát tín hiệu âm thanh chuông cảnh báo trực tiếp tại màn hình Radar của giáo viên khi phát hiện học sinh rời tab hoặc mất tiêu điểm cửa sổ.'
    ),
    bulletParagraph(
      'Chức năng Quản lý lớp học thông minh và bảo mật phân quyền: ',
      'Toàn bộ các lớp đều gắn thông tin quản lý trực tiếp của giáo viên phụ trách, hỗ trợ chỉnh sửa nhiệm vụ trực tiếp, nhập danh sách học sinh nhanh từ tệp Excel/CSV, vẽ biểu đồ thống kê trực quan lượng học sinh tham gia làm bài theo từng tuần, quản lý sơ đồ lớp và bảo vệ tuyệt đối Góc Giáo Viên cũng như Góc Phụ Huynh bằng hai mã PIN độc lập được ẩn hoàn toàn trên giao diện công khai.'
    ),

    // ------------------- SECTION 5 -------------------
    sectionHeading('5. HƯỚNG DẪN VÀ PHÂN TÍCH CÁCH THỨC SỬ DỤNG CHI TIẾT'),
    subHeading('5.1. Quy trình chung các bước sử dụng phần mềm'),
    bodyParagraph(
      'Quy trình khai thác học liệu số MathQuest THCS trong một chu trình dạy học – kiểm tra đánh giá môn Toán được thực hiện khép kín qua 06 bước như Sơ đồ 2 sau đây:',
      { indentFirstLine: true }
    ),

    // SƠ ĐỒ QUY TRÌNH CHUNG (Clean B&W Flowchart Table)
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            makeTableCell(
              [
                { text: 'BƯỚC 1: TRUY CẬP & CHỌN KHÔNG GIAN', bold: true, align: AlignmentType.CENTER },
                { text: 'Mở link web MathQuest THCS → Chọn Góc Học Sinh, Góc Phụ Huynh (nhập mã PIN riêng) hoặc Góc Giáo Viên (nhập mã PIN riêng).', align: AlignmentType.CENTER },
              ],
              100
            ),
          ],
        }),
        new TableRow({
          children: [
            makeTableCell([{ text: '↓', bold: true, align: AlignmentType.CENTER }], 100),
          ],
        }),
        new TableRow({
          children: [
            makeTableCell(
              [
                { text: 'BƯỚC 2: THIẾT LẬP LỚP HỌC & TẠO ĐỀ AI KÈM GIẢI CHI TIẾT', bold: true, align: AlignmentType.CENTER },
                { text: 'Giáo viên nhập danh sách học sinh từ Excel → Vào mục "Tạo Đề AI & Giải Chi Tiết" chọn Khối (6–9), loại đề (15p / Giữa kỳ / Cuối kỳ / Chuyên đề), nhấn tạo đề và in bản A4 hoặc lưu vào kho đề thi thử.', align: AlignmentType.CENTER },
              ],
              100
            ),
          ],
        }),
        new TableRow({
          children: [
            makeTableCell([{ text: '↓', bold: true, align: AlignmentType.CENTER }], 100),
          ],
        }),
        new TableRow({
          children: [
            makeTableCell(
              [
                { text: 'BƯỚC 3: TỔ CHỨC HỌC TẬP TƯƠNG TÁC TRÊN LỚP & Ở NHÀ', bold: true, align: AlignmentType.CENTER },
                { text: 'Học sinh luyện tập qua Trò chơi Toán học, Vận động Camera, Bài giảng trực quan hoặc làm Đề thi thử / Bài tập về nhà có đồng hồ đếm ngược.', align: AlignmentType.CENTER },
              ],
              100
            ),
          ],
        }),
        new TableRow({
          children: [
            makeTableCell([{ text: '↓', bold: true, align: AlignmentType.CENTER }], 100),
          ],
        }),
        new TableRow({
          children: [
            makeTableCell(
              [
                { text: 'BƯỚC 4: GIÁM SÁT TRUNG THỰC & RÀ SOÁT GIỜ VÀO – GIỜ RA', bold: true, align: AlignmentType.CENTER },
                { text: 'Giáo viên mở "Radar Chống Chuyển Tab" nghe chuông cảnh báo khi học sinh chuyển tab; kiểm tra cột Giờ vào – Giờ ra trong danh sách nộp bài.', align: AlignmentType.CENTER },
              ],
              100
            ),
          ],
        }),
        new TableRow({
          children: [
            makeTableCell([{ text: '↓', bold: true, align: AlignmentType.CENTER }], 100),
          ],
        }),
        new TableRow({
          children: [
            makeTableCell(
              [
                { text: 'BƯỚC 5: CHẤM ĐIỂM, ĐỐI CHIẾU GIẢI CHI TIẾT & THỐNG KÊ TUẦN', bold: true, align: AlignmentType.CENTER },
                { text: 'Hệ thống tự chấm phần Trắc nghiệm, Đúng/Sai, Trả lời ngắn; hiển thị lời giải chi tiết từng bước & biểu điểm tự luận; tự vẽ biểu đồ thống kê tuần.', align: AlignmentType.CENTER },
              ],
              100
            ),
          ],
        }),
        new TableRow({
          children: [
            makeTableCell([{ text: '↓', bold: true, align: AlignmentType.CENTER }], 100),
          ],
        }),
        new TableRow({
          children: [
            makeTableCell(
              [
                { text: 'BƯỚC 6: PHẢN HỒI PHỤ HUYNH & CẬP NHẬT SỔ ĐIỂM VNEDU', bold: true, align: AlignmentType.CENTER },
                { text: 'Giáo viên gửi kín mã PIN Góc Phụ Huynh và phiếu báo cáo PDF; phụ huynh đăng nhập theo dõi tiến bộ của con; GVCN cập nhật sơ đồ lớp và VnEdu.', align: AlignmentType.CENTER },
              ],
              100
            ),
          ],
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: SINGLE_LINE, lineRule: LineRuleType.AUTO, before: 60, after: 120 },
      children: [
        new TextRun({
          text: 'Sơ đồ 2. Quy trình 06 bước sử dụng học liệu số MathQuest THCS trong dạy học môn Toán.',
          font: FONT_NAME,
          size: BODY_SIZE,
          italics: true,
          color: '000000',
        }),
      ],
    }),

    subHeading('5.2. Trình bày chi tiết các bước sử dụng (kèm hình ảnh minh họa)'),

    labeledParagraph(
      'Bước 1: Truy cập giao diện chính và phân quyền 3 không gian người dùng. ',
      `Người dùng truy cập đường dẫn ${config.onlineAppUrl.trim()}. Trên thanh điều hướng trên cùng hiển thị rõ 3 không gian độc lập: "Góc Học Sinh" (vào thẳng không cần mật khẩu), "Góc Phụ Huynh" (có biểu tượng khóa mã riêng) và "Góc Giáo Viên (Cô Diễm Quỳnh)" (có biểu tượng khóa mã riêng). Mọi mật mã đều được ẩn bảo mật dưới dạng ký tự chấm tròn để tránh lộ lọt khi trình chiếu trên lớp.`
    ),
    ...buildScreenshotBlock(
      findShot('step1'),
      'Hình 1. Giao diện trang chủ MathQuest THCS với thanh điều hướng 3 không gian Học sinh – Phụ huynh – Giáo viên.'
    ),

    labeledParagraph(
      'Bước 2: Sử dụng chức năng "Tạo Đề AI & Giải Chi Tiết" không cần kho tài liệu. ',
      'Giáo viên (hoặc học sinh tự ôn tập) chọn thẻ "Tạo Đề AI & Giải Chi Tiết". Tại khung thiết lập: (1) Chọn Khối lớp 6, 7, 8 hoặc 9; (2) Chọn Học kỳ 1 hoặc Học kỳ 2; (3) Chọn Mức độ phân hóa (Cơ bản / Chuẩn GDPT 2018 / Nâng cao); (4) Chọn mẫu cấu trúc đề thi (Đề Giữa kỳ 60 phút hoặc Cuối kỳ 90 phút gồm 12 TN ABCD + 1 Đúng/Sai 4 ý + 2 Trả lời ngắn + 5 Tự luận; hoặc Đề Kiểm tra 15 phút gồm 4 TN ABCD + 2 Tự luận; hoặc Đề chuyên đề tùy chỉnh); (5) Nhập yêu cầu nội dung bài học hoặc bấm chọn các thẻ chuyên đề gợi ý. Sau đó nhấn nút "Tạo Đề Thi & Lời Giải Chi Tiết Bằng AI Ngay". Trong 15–30 giây, hệ thống sinh đề mới hoàn chỉnh và tự động lưu vào "Kho Đề AI Đã Tạo".'
    ),
    ...buildScreenshotBlock(
      findShot('step2'),
      'Hình 2. Giao diện thiết lập ma trận và tạo đề thi Toán bằng AI không cần kho tài liệu.'
    ),

    labeledParagraph(
      'Bước 3: Khai thác mục "Giải Chi Tiết Từng Bước", phân tích sâu AI và In giấy A4. ',
      'Sau khi đề được tạo, người dùng chuyển sang thẻ "Giải Chi Tiết Từng Bước" để xem đáp án chuẩn, lời giải từng bước của mọi câu hỏi, giải thích từng ý a, b, c, d của câu Đúng/Sai và bảng biểu điểm chấm chi tiết cho các câu Tự luận. Với những câu khó, nhấn nút "AI Giải Thích Sâu Hơn" để hệ thống phân tích theo 4 phần sư phạm: Kiến thức áp dụng – Các bước giải – Lỗi sai thường gặp – Mẹo làm nhanh. Giáo viên có thể nhấn "In Đề A4" (để phát giấy cho lớp) hoặc "In Giải Chi Tiết A4" (làm tài liệu hướng dẫn chấm), hoặc nhấn "Làm Thử / Thi Ngay" để chuyển sang phòng thi trực tuyến.'
    ),
    ...buildScreenshotBlock(
      findShot('step3'),
      'Hình 3. Mục Giải Chi Tiết từng bước, biểu điểm chấm tự luận và phân tích sư phạm 4 bước bằng AI.'
    ),

    labeledParagraph(
      'Bước 4: Tổ chức luyện đề thi thử, bài tập về nhà và trò chơi tương tác cho học sinh. ',
      'Trong "Góc Học Sinh", học sinh có thể tham gia 5 trò chơi Toán học, trải nghiệm mục "Vận Động Cơ Thể Camera" (giơ tay trái/phải hoặc nghiêng người chọn đáp án; nếu thiết bị không cấp quyền Camera, hệ thống tự động mở hướng dẫn khắc phục và cho phép chuyển sang chế độ Bấm Phím Dự Phòng không cần Camera). Khi vào "Luyện Đề Giữa/Cuối Kỳ" hoặc "Làm Bài Tập Về Nhà", đồng hồ đếm ngược kích hoạt và bài làm được lưu liên tục sau mỗi thao tác để học sinh không bao giờ bị mất bài đang làm dở.'
    ),
    ...buildScreenshotBlock(
      findShot('step4'),
      'Hình 4. Phòng thi trực tuyến của học sinh với đầy đủ 4 dạng câu hỏi và trò chơi Toán học tương tác.'
    ),

    labeledParagraph(
      'Bước 5: Quản lý lớp học, nhập danh sách Excel, giám sát chống chuyển tab và thống kê tuần. ',
      'Giáo viên nhập mã PIN riêng vào "Góc Giáo Viên". Tại mục "Sổ Điểm Môn Toán & Thứ Hạng", giáo viên chỉnh sửa trực tiếp nhiệm vụ phụ trách, bấm "Nhập Excel" để tải danh sách lớp lên nhanh chóng, và xem biểu đồ cột thống kê lượng học sinh tham gia làm bài qua từng tuần. Tại mục "Radar Chống Chuyển Tab (Live)" và "Giám Sát BTVN", giáo viên theo dõi chính xác cột Giờ vào – Giờ ra của từng học sinh; khi học sinh chuyển tab trình duyệt trong lúc làm bài, máy giáo viên lập tức phát âm thanh chuông cảnh báo và ghi nhật ký vi phạm.'
    ),
    ...buildScreenshotBlock(
      findShot('step5'),
      'Hình 5. Không gian Góc Giáo Viên: Thống kê báo cáo tuần, cột giờ vào – giờ ra và Radar cảnh báo chuyển tab.'
    ),

    labeledParagraph(
      'Bước 6: Vận hành Góc Phụ Huynh bảo mật, Sơ đồ chỗ ngồi và Sổ điểm VnEdu. ',
      'Trong Góc Giáo Viên, giáo viên mở nút "Quản Lý & Gửi Riêng Mã PH" để đổi mã PIN bảo mật hoặc sao chép tin nhắn mẫu gửi riêng cho từng phụ huynh. Phụ huynh dùng mã này mở "Góc Phụ Huynh", tra cứu kết quả học tập, độ trung thực và nhận xét của con. Ngoài ra, ở chế độ "GV Chủ Nhiệm", giáo viên quản lý trực quan Sơ đồ chỗ ngồi lớp học (4 Dãy / 4 Tổ) và Sổ điểm điện tử VnEdu tổng hợp các môn học.'
    ),
    ...buildScreenshotBlock(
      findShot('step6'),
      'Hình 6. Góc Phụ Huynh bảo mật bằng mã riêng và công cụ GV Chủ Nhiệm (Sơ đồ lớp học & Sổ điểm VnEdu).'
    ),

    subHeading('5.3. Giải thích vì sao lại sử dụng như vậy và để làm gì?'),
    bodyParagraph(
      'Mỗi chức năng và thao tác trong quy trình sử dụng MathQuest THCS đều được thiết kế có chủ đích sư phạm rõ ràng, gắn trực tiếp với yêu cầu đổi mới phương pháp dạy học và kiểm tra đánh giá môn Toán THCS:',
      { indentFirstLine: true }
    ),

    // Bảng phân tích sư phạm: Vì sao & Để làm gì
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            makeTableCell([{ text: 'Thành phần / Cách sử dụng', bold: true, align: AlignmentType.CENTER }], 24),
            makeTableCell([{ text: 'Vì sao thiết kế và sử dụng như vậy?', bold: true, align: AlignmentType.CENTER }], 38),
            makeTableCell([{ text: 'Để làm gì? (Hiệu quả sư phạm)', bold: true, align: AlignmentType.CENTER }], 38),
          ],
        }),
        new TableRow({
          children: [
            makeTableCell([{ text: '1. Tạo Đề AI không cần kho tài liệu + Giải Chi Tiết', bold: true }], 24),
            makeTableCell([
              { text: 'Kho đề tĩnh dễ bị học sinh học tủ hoặc trùng lặp câu hỏi giữa các lớp; giáo viên tốn nhiều giờ đánh máy công thức và viết đáp án chi tiết.' },
            ], 38),
            makeTableCell([
              { text: 'Giúp giáo viên tạo vô hạn đề mới đúng chuẩn cấu trúc 15p / Giữa kỳ / Cuối kỳ trong 30 giây; giúp học sinh tự học thông qua lời giải chi tiết 4 bước và tránh lỗi sai phổ biến.' },
            ], 38),
          ],
        }),
        new TableRow({
          children: [
            makeTableCell([{ text: '2. Cấu trúc đề 4 dạng câu hỏi (TN ABCD, Đ/S 4 ý, TLN, Tự luận)', bold: true }], 24),
            makeTableCell([
              { text: 'Bám sát định hướng kiểm tra đánh giá năng lực mới của Bộ GD&ĐT, hạn chế tối đa việc học sinh khoanh bừa đáp án trắc nghiệm.' },
            ], 38),
            makeTableCell([
              { text: 'Đánh giá toàn diện từ tư duy tính toán nhanh (TN, TLN), năng lực phản biện – xét tính đúng sai (Đ/S 4 ý) đến năng lực trình bày lập luận chặt chẽ (Tự luận).' },
            ], 38),
          ],
        }),
        new TableRow({
          children: [
            makeTableCell([{ text: '3. Trò chơi Toán học & Vận động Camera (kèm nút bấm dự phòng)', bold: true }], 24),
            makeTableCell([
              { text: 'Học sinh THCS dễ căng thẳng khi học Toán thuần lý thuyết; đồng thời không phải máy tính/điện thoại nào cũng bật được Camera.' },
            ], 38),
            makeTableCell([
              { text: 'Tăng hứng thú học tập, rèn phản xạ tính nhẩm kết hợp vận động thể chất, đồng thời đảm bảo 100% học sinh đều tham gia được ngay cả khi không có Camera.' },
            ], 38),
          ],
        }),
        new TableRow({
          children: [
            makeTableCell([{ text: '4. Radar chống chuyển tab (chuông báo) + Cột Giờ vào/Giờ ra', bold: true }], 24),
            makeTableCell([
              { text: 'Kiểm tra trực tuyến dễ phát sinh tình trạng mở tab tra Google/AI giải hộ hoặc nộp bài đối phó trong vài giây.' },
            ], 38),
            makeTableCell([
              { text: 'Giữ kỷ cương phòng thi trực tuyến, rèn đức tính trung thực và ý thức tự giác; cung cấp minh chứng khách quan về thời gian làm bài thực tế để giáo viên trao đổi với phụ huynh.' },
            ], 38),
          ],
        }),
        new TableRow({
          children: [
            makeTableCell([{ text: '5. Bảo mật mã PIN ẩn riêng cho Góc GV & Góc PH + Thống kê tuần + Excel', bold: true }], 24),
            makeTableCell([
              { text: 'Dữ liệu điểm số, SĐT phụ huynh và công cụ quản trị cần được bảo vệ tuyệt đối khi giáo viên chiếu màn hình trên lớp; danh sách lớp nhiều học sinh khó nhập tay.' },
            ], 38),
            makeTableCell([
              { text: 'Bảo vệ quyền riêng tư học sinh – phụ huynh; tiết kiệm 80% thời gian quản lý hành chính; giúp GV và PH nắm bắt kịp thời xu hướng tiến bộ từng tuần để can thiệp sư phạm sớm.' },
            ], 38),
          ],
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: SINGLE_LINE, lineRule: LineRuleType.AUTO, before: 60, after: 140 },
      children: [
        new TextRun({
          text: 'Bảng 1. Phân tích cơ sở sư phạm và mục đích sử dụng của các chức năng trong MathQuest THCS.',
          font: FONT_NAME,
          size: BODY_SIZE,
          italics: true,
          color: '000000',
        }),
      ],
    }),

    subHeading('5.4. Video hướng dẫn chi tiết trên YouTube'),
    bodyParagraph(
      'Để minh họa trực quan toàn bộ quy trình thao tác thực tế trên phần mềm MathQuest THCS (từ bước Tạo Đề AI kèm Giải Chi Tiết, tổ chức học sinh làm bài, kiểm tra Radar cảnh báo chuyển tab đến tra cứu Góc Phụ Huynh), người đọc có thể theo dõi video hướng dẫn chi tiết được đăng tải trên YouTube theo liên kết dưới đây:',
      { indentFirstLine: true }
    ),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              borders: CELL_BORDERS,
              margins: { top: 100, bottom: 100, left: 140, right: 140 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  spacing: { line: SINGLE_LINE, lineRule: LineRuleType.AUTO },
                  children: [
                    new TextRun({
                      text: 'Link video YouTube hướng dẫn chi tiết: ',
                      font: FONT_NAME,
                      size: BODY_SIZE,
                      bold: true,
                      color: '000000',
                    }),
                    config.youtubeUrl.trim()
                      ? new ExternalHyperlink({
                          link: config.youtubeUrl.trim(),
                          children: [
                            new TextRun({
                              text: config.youtubeUrl.trim(),
                              font: FONT_NAME,
                              size: BODY_SIZE,
                              underline: {},
                              color: '000000',
                            }),
                          ],
                        })
                      : new TextRun({
                          text: '[Dán đường link video YouTube hướng dẫn sử dụng phần mềm của học viên vào đây trước khi nộp bài]',
                          font: FONT_NAME,
                          size: BODY_SIZE,
                          italics: true,
                          color: '000000',
                        }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),

    new Paragraph({ children: [new PageBreak()] }),
  ];

  // =========================================================================
  // LAST PAGE: TÀI LIỆU THAM KHẢO (Exact 3 sections per Image 5)
  // =========================================================================
  const referencesChildren: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: SINGLE_LINE, lineRule: LineRuleType.AUTO, before: 60, after: 200 },
      children: [
        new TextRun({
          text: 'TÀI LIỆU THAM KHẢO',
          font: FONT_NAME,
          size: 28,
          bold: true,
          color: '000000',
        }),
      ],
    }),

    // Tiếng Việt
    subHeading('Tiếng Việt'),
    bodyParagraph(
      '[1] Bộ Giáo dục và Đào tạo (2018), Chương trình Giáo dục phổ thông môn Toán (Ban hành kèm theo Thông tư số 32/2018/TT-BGDĐT ngày 26 tháng 12 năm 2018 của Bộ trưởng Bộ Giáo dục và Đào tạo), Hà Nội.',
      { indentFirstLine: false, spaceAfter: 60 }
    ),
    bodyParagraph(
      '[2] Bộ Giáo dục và Đào tạo (2021), Thông tư số 22/2021/TT-BGDĐT quy định về đánh giá học sinh trung học cơ sở và học sinh trung học phổ thông, Hà Nội.',
      { indentFirstLine: false, spaceAfter: 60 }
    ),
    bodyParagraph(
      '[3] Bộ Giáo dục và Đào tạo (2022), Thông tư số 09/2021/TT-BGDĐT quy định về quản lý và tổ chức dạy học trực tuyến trong cơ sở giáo dục phổ thông và cơ sở giáo dục thường xuyên, Hà Nội.',
      { indentFirstLine: false, spaceAfter: 60 }
    ),
    bodyParagraph(
      '[4] Thủ tướng Chính phủ (2022), Quyết định số 131/QĐ-TTg phê duyệt Đề án "Tăng cường ứng dụng công nghệ thông tin và chuyển đổi số trong giáo dục và đào tạo giai đoạn 2022 - 2025, định hướng đến năm 2030", Hà Nội.',
      { indentFirstLine: false, spaceAfter: 60 }
    ),
    bodyParagraph(
      '[5] Nguyễn Bá Kim (2015), Phương pháp dạy học môn Toán, Nhà xuất bản Đại học Sư phạm, Hà Nội.',
      { indentFirstLine: false, spaceAfter: 60 }
    ),
    bodyParagraph(
      '[6] Đỗ Đức Thái (Tổng chủ biên), Lê Tuấn Hoa, Phạm Xuân Chung, Nguyễn Sơn Hà, Phạm Sỹ Nam (2021), Sách giáo khoa Toán 6, 7, 8, 9 (Bộ sách Cánh Diều / Kết nối tri thức với cuộc sống), Nhà xuất bản Giáo dục Việt Nam.',
      { indentFirstLine: false, spaceAfter: 120 }
    ),

    // Tiếng Anh
    subHeading('Tiếng Anh'),
    bodyParagraph(
      '[7] Kapp, K. M. (2012), The Gamification of Learning and Instruction: Game-based Methods and Strategies for Training and Education, Pfeiffer / Wiley, San Francisco.',
      { indentFirstLine: false, spaceAfter: 60 }
    ),
    bodyParagraph(
      '[8] Mayer, R. E. (2009), Multimedia Learning (2nd Edition), Cambridge University Press, New York.',
      { indentFirstLine: false, spaceAfter: 60 }
    ),
    bodyParagraph(
      '[9] National Council of Teachers of Mathematics (NCTM) (2014), Principles to Actions: Ensuring Mathematical Success for All, Reston, VA.',
      { indentFirstLine: false, spaceAfter: 60 }
    ),
    bodyParagraph(
      '[10] UNESCO (2023), Guidance for Generative AI in Education and Research, United Nations Educational, Scientific and Cultural Organization, Paris.',
      { indentFirstLine: false, spaceAfter: 60 }
    ),
    bodyParagraph(
      '[11] Vygotsky, L. S. (1978), Mind in Society: The Development of Higher Psychological Processes, Harvard University Press, Cambridge, MA.',
      { indentFirstLine: false, spaceAfter: 120 }
    ),

    // Link web
    subHeading('Link web'),
    bodyParagraph(
      `[12] Học liệu số MathQuest THCS (Sản phẩm thiết kế của học viên): ${config.onlineAppUrl.trim()}`,
      { indentFirstLine: false, spaceAfter: 60 }
    ),
    bodyParagraph(
      '[13] Bộ Giáo dục và Đào tạo Việt Nam – Cổng thông tin điện tử Chương trình GDPT 2018: https://moet.gov.vn',
      { indentFirstLine: false, spaceAfter: 60 }
    ),
    bodyParagraph(
      '[14] Thư viện hiển thị công thức Toán học chuẩn KaTeX: https://katex.org',
      { indentFirstLine: false, spaceAfter: 60 }
    ),
    bodyParagraph(
      '[15] Tài liệu kỹ thuật React, TypeScript và Trí tuệ nhân tạo tạo sinh trong giáo dục: https://react.dev và https://ai.google.dev',
      { indentFirstLine: false, spaceAfter: 60 }
    ),
  ];

  // Construct complete A4 document with EXACT margins: Left 3cm, Top/Right/Bottom 2cm
  const doc = new Document({
    creator: config.studentFullName || 'Trần Thị Diễm Quỳnh',
    title: `Tiểu luận - Thiết kế phần mềm ${config.softwareName}`,
    description: 'Tiểu luận thi hết học phần chuẩn định dạng Trường Đại học Sư phạm - Đại học Đà Nẵng',
    styles: {
      default: {
        document: {
          run: {
            font: FONT_NAME,
            size: BODY_SIZE,
            color: '000000',
          },
          paragraph: {
            spacing: {
              line: SINGLE_LINE,
              lineRule: LineRuleType.AUTO,
            },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: PageOrientation.PORTRAIT,
              width: convertMillimetersToTwip(210), // A4 width
              height: convertMillimetersToTwip(297), // A4 height
            },
            margin: {
              top: convertMillimetersToTwip(20),    // 2 cm
              bottom: convertMillimetersToTwip(20), // 2 cm
              right: convertMillimetersToTwip(20),  // 2 cm
              left: convertMillimetersToTwip(30),   // 3 cm (EXACT REQUIREMENT!)
            },
          },
        },
        children: [
          ...coverPageChildren,
          ...tocChildren,
          ...contentChildren,
          ...referencesChildren,
        ],
      },
    ],
  });

  return doc;
}

export async function generateWordEssayDocx(config: WordEssayConfig): Promise<Blob> {
  const doc = buildWordEssayDocument(config);
  return await Packer.toBlob(doc);
}

export async function generateWordEssayBuffer(config: WordEssayConfig): Promise<Buffer> {
  const doc = buildWordEssayDocument(config);
  return await Packer.toBuffer(doc);
}
