# ArtGuard AI - Museum Security Assistant

Voice-controlled security command center for museums.

## Team Roles

- **Person 1 (Voice & AI Logic)**: Voice recognition, command processing, integration
- **Person 2 (Camera Feeds)**: Canvas animations, camera grid, visual effects  
- **Person 3 (UI/UX & Data)**: Dashboard layout, mock data, scenarios, presentation

## File Ownership

- `app/page.jsx` - Person 1 (integration point)
- `components/VoiceInput.jsx, ChatLog.jsx` - Person 1
- `components/CameraGrid.jsx, AnimatedCamera.jsx` - Person 2
- `components/AlertPanel.jsx, ScenarioButtons.jsx` - Person 3
- `lib/smartResponses.js, textToSpeech.js` - Person 1
- `lib/museumData.js, scenarios.js` - Person 3

## Setup
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Checkpoints

- Hour 2: POC complete
- Hour 4: Core features working
- Hour 7: Feature complete
- Hour 9: Polished
- Hour 10: Demo ready