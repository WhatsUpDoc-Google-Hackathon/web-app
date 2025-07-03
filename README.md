# 🩺 MedAI - Intelligent Pre-diagnosis Platform

<div align="center">

![Google Healthcare Hackathon](https://img.shields.io/badge/Google-Healthcare%20Hackathon-4285F4?style=for-the-badge&logo=google&logoColor=white)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![HeyGen](https://img.shields.io/badge/HeyGen-Streaming%20Avatar-FF6B6B?style=for-the-badge)

**🏆 Built for the [Google Healthcare Hackathon](https://gdg.community.dev/events/details/google-gdg-paris-presents-solve-for-healthcare-amp-life-sciences-with-gemma-hackathon-1/) by EPITA Students**

_An automated pre-diagnosis tool and patient scheduling prioritization system powered by [MedGemma](https://deepmind.google/models/gemma/medgemma/) AI_

</div>

## 🌟 Project Overview

MedAI is an innovative healthcare application that combines AI-powered pre-diagnosis with realistic virtual consultations. The platform uses Google's MedGemma AI model and HeyGen's streaming avatar technology to provide interactive medical consultations and intelligent patient prioritization.

### 🎯 Key Features

- **🤖 AI Virtual Doctor**: Interactive consultations with HeyGen streaming avatars
- **📊 Smart Prioritization**: Automated patient scheduling based on urgency assessment
- **📋 Medical Reports**: Comprehensive patient dashboard with PDF report viewing
- **📈 Patient Timeline**: Historical tracking of medical consultations and reports
- **🎨 Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS

## 🚀 Live Demo

- **🏠 Homepage**: Access the main platform interface
- **📞 Virtual Consultation**: `/call/:id` - Interactive AI consultation with HeyGen avatar
- **📊 Doctor Dashboard**: `/report/:doctorID` - Patient management interface
- **📄 Report Details**: `/report/:doctorID/:reportID` - Detailed patient reports with PDF viewing

## 🏗️ Project Structure

```
user-interface/
├── 📁 src/
│   ├── 🎭 animations/           # Framer Motion animations
│   │   └── callAnimations.ts    # Call interface animations
│   ├── 🔌 api/                  # API integrations
│   │   └── heygen-token/        # HeyGen authentication
│   │       └── getAccessToken.ts
│   ├── 🧩 components/           # React components
│   │   ├── callComponents/      # Video call interface
│   │   │   ├── CallVideo.tsx    # HeyGen avatar video component
│   │   │   ├── CallNavbar.tsx   # Call controls
│   │   │   ├── CallSidebar.tsx  # Chat sidebar
│   │   │   └── ...
│   │   ├── mainComponents/      # Shared components
│   │   │   ├── AnimatedBackground.tsx
│   │   │   └── Footer.tsx
│   │   └── reportComponents/    # Medical reports interface
│   │       ├── DoctorNavbar.tsx
│   │       ├── PatientRow.tsx
│   │       ├── PatientTimeline.tsx
│   │       └── ...
│   ├── 🎨 constants/            # App constants
│   │   └── colors.ts            # Theme colors
│   ├── 🤖 heygen/               # HeyGen integration
│   │   └── StreamingAvatarContext.tsx
│   ├── 📄 pages/                # Route components
│   │   ├── Home.tsx             # Landing page
│   │   ├── Call.tsx             # Virtual consultation
│   │   ├── DoctorReports.tsx    # Patient dashboard
│   │   ├── ReportDetail.tsx     # Individual reports
│   │   └── NotFound.tsx         # 404 page
│   └── ...
├── 📁 public/                   # Static assets
│   ├── team/                    # Team member photos
│   └── sample-report.pdf        # Sample medical report
├── 📦 package.json              # Dependencies & scripts
├── ⚙️ vite.config.ts           # Vite configuration
├── 🎨 tailwind.config.js       # Tailwind CSS config
└── 📖 README.md                # This file
```

## 🤖 HeyGen Integration Deep Dive

### 🔧 Core Implementation

The HeyGen streaming avatar integration is the heart of our virtual consultation system:

#### **StreamingAvatarContext** (`src/heygen/StreamingAvatarContext.tsx`)

```typescript
// Key features implemented:
- Real-time video streaming with WebRTC
- Voice emotion and speech synthesis
- Speech-to-text integration with Deepgram
- Avatar state management (connecting, ready, speaking)
- Session lifecycle management
```

#### **Avatar States**

- `DISCONNECTED` - Initial state
- `CONNECTING` - Establishing connection
- `CONNECTED` - Connected but not ready
- `READY` - Ready for interaction
- `SPEAKING` - Avatar is currently speaking
- `ERROR` - Connection error

#### **Key Features**

- **🎙️ Voice Chat**: WebSocket-based real-time communication
- **🎭 Avatar**: "Ann_Doctor_Sitting_public" medical avatar
- **🗣️ TTS**: Text-to-speech with emotional voice settings
- **👂 STT**: Speech-to-text using Deepgram provider
- **📹 High Quality**: HD video streaming with optimized performance

### 🔐 Authentication Flow

```typescript
// Token-based authentication
const HEYGEN_API_KEY = import.meta.env.VITE_HEYGEN_TOKEN;

// Secure token retrieval
export async function get_access_token() {
  const res = await fetch(`https://api.heygen.com/v1/streaming.create_token`, {
    method: "POST",
    headers: { "x-api-key": HEYGEN_API_KEY },
  });
  return res.json().data.token;
}
```

### 🎯 Usage in Components

```typescript
// In Call component
const { speakText, isReady, mediaStream, status } = useStreamingAvatar();

// Send message to avatar
await speakText("Hello, how can I help you today?");

// Video rendering
<video ref={videoRef} autoPlay muted playsInline />;
```

## 🛠️ Technology Stack

### **Frontend Framework**

- ![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react) - Latest React with concurrent features
- ![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat-square&logo=typescript) - Type-safe development
- ![Vite](https://img.shields.io/badge/Vite-7.0.1-646CFF?style=flat-square&logo=vite) - Fast build tooling

### **Styling & Animation**

- ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.11-38B2AC?style=flat-square&logo=tailwind-css) - Utility-first CSS
- ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12.23.0-FF0055?style=flat-square) - Advanced animations

### **AI & Media Processing**

- ![HeyGen](https://img.shields.io/badge/HeyGen-2.0.16-FF6B6B?style=flat-square) - Streaming avatar technology
- ![React PDF](https://img.shields.io/badge/React%20PDF-10.0.1-FF4B4B?style=flat-square) - PDF document viewing
- ![PDF.js](https://img.shields.io/badge/PDF.js-3.11.174-FF6B35?style=flat-square) - PDF rendering engine

### **State Management & Routing**

- ![Zustand](https://img.shields.io/badge/Zustand-5.0.6-FF9500?style=flat-square) - Lightweight state management
- ![React Router](https://img.shields.io/badge/React%20Router-7.6.3-CA4245?style=flat-square&logo=react-router) - Client-side routing

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **HeyGen API Key** (for avatar functionality)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd user-interface
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   # Create .env file
   echo "VITE_HEYGEN_TOKEN=your_heygen_api_key_here" > .env
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

### 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🎨 UI/UX Features

### **Design Principles**

- **🏥 Medical-First**: Clean, professional healthcare interface
- **♿ Accessible**: WCAG compliant design patterns
- **📱 Responsive**: Mobile-first responsive design
- **🎭 Animated**: Smooth Framer Motion animations
- **🌟 Modern**: Glass morphism and modern UI patterns

### **Color Scheme**

```css
/* Primary Healthcare Colors */
--color-primary: #2563eb    /* Professional blue */
--color-accent: #60a5fa     /* Light blue accent */
--color-success: #10b981    /* Medical green */
--color-warning: #f59e0b    /* Attention yellow */
--color-critical: #ef4444   /* Critical red */
```

## 👥 Team

<div align="center">

### 🎓 EPITA Students - Google Healthcare Hackathon Team

| Name                 | Role                    | LinkedIn                                                                                                                                                   |
| -------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Armand Blin**      | IA & Machine Learning   | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/armandblin/)       |
| **Arthur Courselle** | UX/UI Design            | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/arthur-courselle/) |
| **Aurélien Daudin**  | Développement Frontend  | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/aurelien-daudin/)  |
| **Khaled Mili**      | Data Science            | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/khaled-mili/)      |
| **Lucas Duport**     | DevOps & Infrastructure | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/lucas-duport/)     |
| **Wassim Yacef**     | Full-Stack Development  | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/wassim-yacef/)     |

</div>

## 🔮 Future Enhancements

- **🧠 Enhanced AI**: Integration with more advanced MedGemma models
- **🔒 Security**: HIPAA compliance and data encryption
- **📊 Analytics**: Advanced patient insights and reporting
- **🌍 Internationalization**: Multi-language support
- **📱 Mobile App**: Native mobile applications
- **🔌 API Integration**: Real EHR system connections

## 📄 License

This project is part of the Google Healthcare Hackathon and is intended for educational and demonstration purposes.

---

<div align="center">

**🏆 Proudly built for the Google Healthcare Hackathon 2025**

[![Google](https://img.shields.io/badge/Powered%20by-Google%20MedGemma-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/models/gemma/medgemma/)
[![HeyGen](https://img.shields.io/badge/Enhanced%20by-HeyGen%20AI-FF6B6B?style=for-the-badge)](https://heygen.com)

_Revolutionizing healthcare through AI-powered pre-diagnosis and virtual consultations_

</div>
