import type {FormDefinition} from '@types/forms';

export const forms: FormDefinition[] = [
  {
    key: 'contact',
    tenantId: 'tenant-main',
    honeypotField: 'website',
    locales: {
      vi: {
        title: 'Gửi thông tin liên hệ',
        description: 'Điền biểu mẫu để đội ngũ CTT phản hồi trong vòng 24 giờ làm việc.',
        submitLabel: 'Gửi thông tin',
        successMessage: 'Cảm ơn bạn! Chúng tôi đã nhận được yêu cầu và sẽ liên hệ sớm nhất.',
        errorMessage: 'Không thể gửi biểu mẫu, vui lòng thử lại sau.',
        fields: [
          {
            name: 'fullName',
            type: 'text',
            label: 'Họ và tên',
            placeholder: 'Nguyễn Văn A',
            required: true,
            maxLength: 120
          },
          {
            name: 'email',
            type: 'email',
            label: 'Email',
            placeholder: 'ban@example.com',
            required: true,
            maxLength: 160
          },
          {
            name: 'phone',
            type: 'text',
            label: 'Số điện thoại',
            placeholder: '+84 912 345 678',
            required: false,
            maxLength: 25
          },
          {
            name: 'message',
            type: 'textarea',
            label: 'Nội dung',
            placeholder: 'Bạn cần hỗ trợ điều gì?',
            required: true,
            minLength: 20,
            rows: 5
          }
        ]
      },
      en: {
        title: 'Send us a message',
        description: 'Fill in the form and we will get back within 24 business hours.',
        submitLabel: 'Submit message',
        successMessage: 'Thank you! Our team has received your request and will respond shortly.',
        errorMessage: 'We could not submit the form. Please try again later.',
        fields: [
          {
            name: 'fullName',
            type: 'text',
            label: 'Full name',
            placeholder: 'Alex Nguyen',
            required: true,
            maxLength: 120
          },
          {
            name: 'email',
            type: 'email',
            label: 'Email',
            placeholder: 'you@example.com',
            required: true,
            maxLength: 160
          },
          {
            name: 'phone',
            type: 'text',
            label: 'Phone number',
            placeholder: '+84 912 345 678',
            required: false,
            maxLength: 25
          },
          {
            name: 'message',
            type: 'textarea',
            label: 'Message',
            placeholder: 'How can we help you?',
            required: true,
            minLength: 20,
            rows: 5
          }
        ]
      }
    }
  },
  {
    key: 'contact',
    tenantId: 'tenant-classic',
    honeypotField: 'website',
    locales: {
      vi: {
        title: 'Liên lạc với học viện',
        description: 'Gửi câu hỏi về chương trình đào tạo, lịch tuyển sinh hoặc workshop.',
        submitLabel: 'Gửi yêu cầu',
        successMessage: 'Cảm ơn bạn đã quan tâm! Học viện sẽ trả lời trong thời gian sớm nhất.',
        errorMessage: 'Gửi thất bại, vui lòng kiểm tra lại thông tin.',
        fields: [
          {
            name: 'fullName',
            type: 'text',
            label: 'Họ tên',
            placeholder: 'Trần Thị B',
            required: true,
            maxLength: 120
          },
          {
            name: 'email',
            type: 'email',
            label: 'Email',
            placeholder: 'hocvien@example.com',
            required: true,
            maxLength: 160
          },
          {
            name: 'interest',
            type: 'text',
            label: 'Quan tâm',
            placeholder: 'Khóa piano, guitar...',
            required: true,
            maxLength: 120
          },
          {
            name: 'message',
            type: 'textarea',
            label: 'Nội dung',
            placeholder: 'Chia sẻ nhu cầu của bạn',
            required: true,
            minLength: 15,
            rows: 4
          }
        ]
      },
      en: {
        title: 'Contact the academy',
        description: 'Ask about training programmes, auditions or upcoming workshops.',
        submitLabel: 'Send request',
        successMessage: 'Thank you for reaching out! Our academy team will reply shortly.',
        errorMessage: 'Submission failed. Please review the form and try again.',
        fields: [
          {
            name: 'fullName',
            type: 'text',
            label: 'Full name',
            placeholder: 'Alex Tran',
            required: true,
            maxLength: 120
          },
          {
            name: 'email',
            type: 'email',
            label: 'Email',
            placeholder: 'academy@example.com',
            required: true,
            maxLength: 160
          },
          {
            name: 'interest',
            type: 'text',
            label: 'Area of interest',
            placeholder: 'Piano course, guitar class…',
            required: true,
            maxLength: 120
          },
          {
            name: 'message',
            type: 'textarea',
            label: 'Message',
            placeholder: 'Tell us what you need support with',
            required: true,
            minLength: 15,
            rows: 4
          }
        ]
      }
    }
  }
];

export function findForm({
  key,
  tenantId
}: {
  key: string;
  tenantId: string;
}) {
  return forms.find((form) => form.key === key && form.tenantId === tenantId);
}
