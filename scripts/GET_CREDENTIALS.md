# How to Get Service Account Credentials

To run the data copy script, you need Firebase service account keys for both projects.

## For SprintUp (Source)

1. Go to [Firebase Console](https://console.firebase.google.com) → **sprintup-eecbe project**
2. Click **Settings** (gear icon) → **Project settings** → **Service accounts**
3. Click **Generate new private key**
4. Save as `/Users/gauravrao/Zentri/scripts/sprintup-serviceAccount.json`

## For Zentri (Destination)

1. Go to [Firebase Console](https://console.firebase.google.com) → **failfast-58c9f project**
2. Click **Settings** (gear icon) → **Project settings** → **Service accounts**
3. Click **Generate new private key**
4. Save as `/Users/gauravrao/Zentri/scripts/zentri-serviceAccount.json`

## Then run the copy script

```bash
cd /Users/gauravrao/Zentri
node scripts/copyCurriculumData.js
```

It will copy all exams, subjects, chapters, topics, concepts, and questions from SprintUp to Zentri.

**⚠️ Keep these JSON files private — they contain credentials. Never commit them to git.**
