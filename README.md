# Professional Login & Registration Portal

A modern, responsive authentication portal built with Next.js 14, featuring professional design, social login integration, and enterprise-grade security.

## 🌟 Features

### 🎨 **Professional Design**
- **Brand Consistency**: Matches China Wholesale corporate theme
- **Responsive Design**: Perfect on all devices (mobile-first approach)
- **Smooth Animations**: Framer Motion micro-interactions and page transitions
- **Professional UI**: Clean cards, gradients, and modern styling
- **Accessibility**: WCAG compliant with proper focus management

### 🔐 **Authentication Options**
- **Email/Password Login**: Secure traditional authentication
- **Social Login**: Google and Facebook OAuth integration ready
- **Registration**: Complete signup flow with validation
- **Remember Me**: Persistent login sessions
- **Forgot Password**: Password recovery flow (ready for implementation)

### ⚡ **Technical Stack**
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion for smooth interactions
- **Forms**: React Hook Form with validation
- **Icons**: Lucide React icon library
- **Notifications**: React Hot Toast for user feedback

### 🛡️ **Security & Validation**
- **Form Validation**: Real-time validation with helpful error messages
- **Input Sanitization**: Proper form data handling
- **Password Requirements**: Strong password enforcement
- **Error Handling**: Graceful error states and user feedback
- **CSRF Protection**: Ready for production security measures

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17 or later
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone https://github.com/kishorkishor/login-reg-page.git
cd login-reg-page

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📱 Pages & Routes

### 🏠 **Home Page** (`/`)
- Welcome screen with animated cards
- Quick access to login and register
- Professional branding and trust indicators

### 🔑 **Login Page** (`/login`)
- Email/password authentication
- Social login options (Google, Facebook)
- Remember me functionality
- Forgot password link
- Form validation and error handling

### 📝 **Register Page** (`/register`)
- Complete registration form
- Password strength requirements
- Terms and conditions acceptance
- Social signup options
- Email confirmation flow

## 🎨 Design System

### Colors
- **Primary**: `#E3431F` (China Wholesale Orange)
- **Secondary**: `#000000` (Deep Black)
- **Accent**: `#F2F2F2` (Neutral Gray)
- **Background**: `#FFFFFF` (Clean White)

### Typography
- **Headings**: Poppins (Professional and modern)
- **Body**: Inter (Excellent readability)

### Components
- **Buttons**: Multiple variants with hover effects
- **Cards**: Elevated shadows with backdrop blur
- **Forms**: Professional inputs with validation states
- **Animations**: Smooth transitions and micro-interactions

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=https://your-api-endpoint.com/api
```

### API Integration
The app is configured to work with REST APIs. Update the base URL in `utils/api.ts` or use environment variables.

### Social Login Setup
To enable Google and Facebook login:
1. Set up OAuth applications in Google/Facebook developer consoles
2. Add OAuth callback URLs
3. Update the social login handlers in the login/register pages

## 📦 Project Structure

```
login-reg-page/
├── app/                    # Next.js 14 App Router
│   ├── globals.css        # Global styles and Tailwind
│   ├── layout.tsx         # Root layout with fonts and metadata
│   ├── page.tsx           # Home page with welcome screen
│   ├── login/             # Login page and layout
│   └── register/          # Registration page and layout
├── components/            # Reusable React components
│   └── ui/               # UI components (Button, Card)
├── utils/                # Utility functions
│   ├── api.ts           # API client and auth functions
│   └── cn.ts            # Class name utility
├── public/              # Static assets
└── styles/              # Additional styling
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Deploy to Other Platforms
The app can be deployed to any platform that supports Node.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Railway
- Render

## 🔐 Security Considerations

### Production Checklist
- [ ] Configure proper CORS settings
- [ ] Set up rate limiting
- [ ] Implement CSRF protection
- [ ] Use HTTPS in production
- [ ] Set secure cookie settings
- [ ] Implement proper session management
- [ ] Add input sanitization
- [ ] Set up monitoring and logging

### Environment Security
- [ ] Use environment variables for sensitive data
- [ ] Never commit API keys or secrets
- [ ] Use different configurations for dev/staging/prod
- [ ] Implement proper error handling without exposing internal details

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

### Adding New Features
1. Create feature branch: `git checkout -b feature/new-feature`
2. Make your changes with proper TypeScript types
3. Test on multiple devices and browsers
4. Update documentation if needed
5. Submit pull request with detailed description

## 📋 TODO / Roadmap

### Immediate
- [ ] Connect to real OAuth providers
- [ ] Implement password reset flow
- [ ] Add email verification
- [ ] Set up proper error logging

### Future Enhancements
- [ ] Two-factor authentication (2FA)
- [ ] Social login with more providers (LinkedIn, Twitter)
- [ ] Progressive Web App (PWA) features
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Advanced security features
- [ ] User profile management
- [ ] Account settings page

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

For support, questions, or feature requests:
- Create an issue on GitHub
- Email: support@chinawholesale.com
- Documentation: Check this README and code comments

## 🙏 Acknowledgments

- Design inspired by modern authentication best practices
- Built for China Wholesale branding and requirements
- Thanks to the Next.js, Tailwind CSS, and Framer Motion communities

---

**Built with ❤️ for professional authentication experiences**

*Last updated: January 2025*