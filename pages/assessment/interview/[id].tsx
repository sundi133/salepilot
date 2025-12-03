```TypeScript
import Webcam from 'react-webcam';
import { AnimatePresence, motion } from 'framer-motion';
import { RadioGroup } from '@headlessui/react';
import { v4 as uuid } from 'uuid';
import Link from 'next/link';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import '../../../app/css/globals.css';
import { Button } from '@tremor/react';
import { useRouter } from 'next/router';
import { gradient } from '../../../components/gradient';
import axios from 'axios';
import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { sql } from '@codemirror/lang-sql';
import { java } from '@codemirror/lang-java';
import { php } from '@codemirror/lang-php';
import { rust } from '@codemirror/lang-rust';
import { cpp } from '@codemirror/lang-cpp';
import { markdown } from '@codemirror/lang-markdown';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { githubLight } from '@uiw/codemirror-theme-github';

const urls = [
  'https://hanhcul9phf2j3we.public.blob.vercel-storage.com/interview/audios/Th0yclWN2o/speech_20-orLvQGu1DuVNOsvZyWdRnlyjECAca2.mp3',
  'https://hanhcul9phf2j3we.public.blob.vercel-storage.com/interview/audios/Th0yclWN2o/speech_1-hxeysKuxr0V2VbdIAk764S2gyAXxPf.mp3',
  'https://hanhcul9phf2j3we.public.blob.vercel-storage.com/interview/audios/Th0yclWN2o/speech_22-Jt0H9RuJu56Pjkb0fIemApiIMeDlDF.mp3',
  'https://hanhcul9phf2j3we.public.blob.vercel-storage.com/interview/audios/Th0yclWN2o/speech_24-L5kSJd4utwQsYv2uERdGvin5qJTeh2.mp3',
  'https://hanhcul9phf2j3we.public.blob.vercel-storage.com/interview/audios/Th0yclWN2o/speech_5-NvVg1bULPjGzEFqZblTHRBiXOm8Qt7.mp3',
  'https://hanhcul9phf2j3we.public.blob.vercel-storage.com/interview/audios/Th0yclWN2o/speech_3-o8i70OFnFYc8idyREp9gJpvcrQiZg9.mp3',
  'https://hanhcul9phf2j3we.public.blob.vercel-storage.com/interview/audios/Th0yclWN2o/speech_7-QWhsvsB9uZzPTtMc9YUiooxT0Yq4a8.mp3',
  'https://hanhcul9phf2j3we.public.blob.vercel-storage.com/interview/audios/Th0yclWN2o/speech_11-mpwish9DCMSlTwfq68whWrGfIegNIu.mp3',
  'https://hanhcul9phf2j3we.public.blob.vercel-storage.com/interview/audios/Th0yclWN2o/speech_9-tEefYIy72jpIefFTbisC0uY9lg5kfp.mp3',
  'https://hanhcul9phf2j3we.public.blob.vercel-storage.com/interview/audios/Th0yclWN2o/speech_15-guWFH5yCo3rtS4RFJckRa5zHsLcdpE.mp3',
  'https://hanhcul9phf2j3we.public.blob.vercel-storage.com/interview/audios/Th0yclWN2o/speech_6-JmulxZPgngsZAauct9BnSDHfNXF74H.mp3',
  'https://hanhcul9phf2j3we.public.blob.vercel-storage.com/interview/audios/Th0yclWN2o/speech_10-IjuhyWGu9KlO95LbSr2wJtcOtwUaDH.mp3',
  'https://hanhcul9phf2j3we.public.blob.vercel-storage.com/interview/audios/Th0yclWN2o/speech_17-5tDcS1hNBxsVLnhq4ZReXqWTVlmJ1D.mp3',
  'https://hanhcul9phf2j3we.public.blob.vercel-storage.com/interview/audios/Th0yclWN2o/speech_18-5pm7Wd6HOSLgu4Sp1kZ8gsD81evrKi.mp3',
  'https://hanhcul9phf2j3we.public.blob.vercel-storage.com/interview/audios/Th0yclWN2o/speech_21-W8ww5MzR6vmfZQtOOVbRSibMD6rAW7.mp3',
  'https://hanhcul9phf2j3we.public.blob.vercel-storage.com/interview/audios/Th0yclWN2o/speech_23-A5QHGLvYHVn9S7QlCNHJrPRh2CzCeA.mp3',
  'https://hanhcul9phf2j3we.public.blob.vercel-storage.com/interview/audios/Th0yclWN2o/speech_12-YaHDtFk0CPUOh1MP6ghZuucR5Uz2Dd.mp3',
  'https://hanhcul9phf2j3we.public.blob.vercel-storage.com/interview/audios/Th0yclWN2o/speech_16-pmKo0EjNylr5Ge7cmb3wuLE9UPMDTf.mp3',
  'https://hanhcul9phf2j3we.public.blob.vercel-storage.com/interview/audios/Th0yclWN2o/speech_2-8r6HVk8SgEV0A0G5p1GrnyEUQKubem.mp3',
  'https://hanhcul9phf2j3we.public.blob.vercel-storage.com/interview/audios/Th0yclWN2o/speech_8-wTNvSzilQJYLDtEmbV71ehand7KClp.mp3',
  'https://hanhcul9phf2j3we.public.blob.vercel-storage.com/interview/audios/Th0yclWN2o/speech_19-nnTXEQEVmPvDbO5neJO9xT59rurVAf.mp3',
  'https://hanhcul9phf2j3we.public.blob.vercel-storage.com/interview/audios/Th0yclWN2o/speech_13-8HgFvTLcIof2WPzFjBEcYzgEDZ18h3.mp3',
  'https://hanhcul9phf2j3we.public.blob.vercel-storage.com/interview/audios/Th0yclWN2o/speech_14-pMalltObkqhHyChiWQi83KPYEPVTnf.mp3',
  'https://hanhcul9phf2j3we.public.blob.vercel-storage.com/interview/audios/Th0yclWN2o/speech_4-UKaqwqvk15YHbjgiHhxjaIkfgVhdBz.mp3',
  'https://hanhcul9phf2j3we.public.blob.vercel-storage.com/interview/audios/Th0yclWN2o/speech_0-vbmrRl2f5jrw7KvhmgKNGwOkIV4bRb.mp3'
];

const ffmpeg = createFFmpeg({
  corePath: 'https://bytegram-beta.vercel.app/ffmpeg/dist/ffmpeg-core.js',
  log: false
});

const InterviewQuestionRecorder = () => {
  const router = useRouter();
  const { id } = router.query; // Gets the id from the URL
  const interviewTimePerQuestion = 120;
  const timeSlotDuration = 5; // Desired time slot duration in seconds

  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);

  const [selected, setSelected] = useState('');
  const [selectedInterviewer, setSelectedInterviewer] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const webcamRef = useRef<Webcam | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [seconds, setSeconds] = useState(120);
  const [totalSeconds, setTotalSeconds] = useState(60 * 60);

  const [audioEnded, setAudioEnded] = useState(false);
  const [recordingPermission, setRecordingPermission] = useState(true);
  const [cameraLoaded, setCameraLoaded] = useState(false);
  const vidRef = useRef<HTMLVideoElement>(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('Processing');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [generatedFeedback, setGeneratedFeedback] = useState('');
  const [audioQuestionLink, setAudioQuestionLink] = useState('');
  const [audioQuestionText, setAudioQuestionText] = useState('');
  const [audioResponseLink, setAudioResponseLink] = useState('');
  const [audioResponseLinkEnd, setAudioResponseLinkEnd] = useState(true);
  const [traits, setTraits] = useState([]);
  const [userButtonMessage, setUserButtonMessage] = useState('');
  const [interviewRole, setInterviewRole] = useState('');
  const [interviewCompany, setInterviewCompany] = useState('');
  const [user, setUser] = useState('');
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [generatedRating, setGeneratedRating] = useState(0);

  const [interviewId, setInterviewId] = useState(0);
  const [questionId, setQuestionId] = useState(0);
  const [candidateId, setCandidateId] = useState(0);
  const [invitationId, setInvitationId] = useState(0);
  const [currentFollowUpLevel, setCurrentFollowUpLevel] = useState(0);
  const [interviewVoiceType, setInterviewVoiceType] = useState('alloy');
  const [interviewIdHexCode, setInterviewIdHexCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [template, setTemplate] = useState(`
    Summarize the evaluation of the candidate on the following criteria:
    - Problem solving skills
    - Communication skills
    - Leadership skills
    - Teamwork skills
    - Technical skills
  `);

  const [userPressedContinue, setUserPressedContinue] = useState(false);
  const [code, setCode] = React.useState('// Write your code here\n');
  const [language, setLanguage] = useState('javascript');

  const languageExtension = useMemo(() => {
    switch (language) {
      case 'sql':
        return sql();
      case 'python':
        return python();
      case 'javascript':
        return javascript();
      case 'java':
        return java();
      case 'cpp':
        return cpp();
      case 'php':
        return php();
      case 'rust':
        return rust();
      case 'markdown':
        return markdown();
      default:
        return [];
    }
  }, [language]);

  const getRandomUrl = () => {
    const randomIndex = Math.floor(Math.random() * urls.length);
    return urls[randomIndex];
  };

  const handleValueChange = (newValue: string) => {
    setCode(newValue);
  };

  const handleLanguageChange = (event: string) => {
    setLanguage(event);
  };

  const [value, setValue] = React.useState('//write your code here\n');
  const onChange = React.useCallback((val: any, viewUpdate: any) => {
    setValue(val);
  }, []);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    gradient.initGradient('#gradient-canvas');
    handleUserMedia();
  }, []);

  useEffect(() => {
    if (audioEnded) {
      const element = document.getElementById('startTimer');

      if (element) {
        element.style.display = 'flex';
      }

      setCapturing(true);
      setIsVisible(false);

      if (webcamRef.current?.stream instanceof MediaStream) {
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream);

        mediaRecorderRef.current.addEventListener(
          'dataavailable',
          handleDataAvailable
        );
        mediaRecorderRef.current.start();
        setUserButtonMessage('Speak Up, then Submit');
      } else {
        console.error('webcamRef.current?.stream is not a valid MediaStream');
      }
    }
  }, [
    audioEnded,
    webcamRef,
    setCapturing,
    mediaRecorderRef,
    invitationId,
    audioQuestionText,
    audioQuestionLink,
    currentQuestionIndex,
    currentFollowUpLevel,
    audioResponseLink,
    audioResponseLinkEnd,
    traits
  ]);

  const handleDataAvailable = useCallback(
    ({ data }: BlobEvent) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  useEffect(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.addEventListener(
        'dataavailable',
        handleDataAvailable
      );
    }
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.removeEventListener(
          'dataavailable',
          handleDataAvailable
        );
      }
    };
  }, [handleDataAvailable, mediaRecorderRef]);

  async function fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number = 15000
  ): Promise<Response> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Request timed out'));
      }, timeout);

      fetch(url, options)
        .then((response) => {
          clearTimeout(timer);
          resolve(response);
        })
        .catch((err) => {
          clearTimeout(timer);
          reject(err);
        });
    });
  }

  const skipQuestion = () => {
    const evaluationData = {
      interviewId: interviewId,
      questionId: questionId,
      candidateId: candidateId,
      invitationId: invitationId,
      rating: 0,
      feedback: 'Candidate skipped the question',
      answer: '',
      video_url: '',
      audio_url: '',
      follow_up_level: 0,
      audio_question_text: audioQuestionText,
      audio_question_link: audioQuestionLink,
      keywords: '',
      sentiment: '',
      traits_evaluation: JSON.stringify({
        traits_evaluation: []
      })
    };
    const evaluation_response = fetch('/api/evaluations/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(evaluationData)
    });
    setIsSuccess(false);
    setSubmitting(true);
    setStatus('Preparing Next Question');
    evaluation_response.then(async (response) => {
      if (response.ok) {
        setCurrentFollowUpLevel(0);
        setCurrentQuestionIndex(currentQuestionIndex + 1);

        setAudioQuestionText(
          (interviewQuestions[currentQuestionIndex + 1] as any)?.question
        );
        setAudioQuestionLink(
          (interviewQuestions[currentQuestionIndex + 1] as any)?.audioLink
        );
        setTraits(
          (interviewQuestions[currentQuestionIndex + 1] as any)?.traits
        );
        setQuestionId(
          (interviewQuestions[currentQuestionIndex + 1] as any)?.id
        );
        const currentQuestion =
          (interviewQuestions[currentQuestionIndex + 1] as any)?.question ?? '';
        if (currentQuestion !== '') {
          setStatus('Submitted');
          setLoading(true);
          setCapturing(false);
          setRecordedChunks([]);
          setSeconds(120);
          setAudioEnded(false);
          setRecordingPermission(true);
          setCameraLoaded(false);
          setSubmitting(false);
          setIsSuccess(false);
          setIsVisible(true);
          setIsDesktop(window.innerWidth >= 768);
          gradient.initGradient('#gradient-canvas');
          handleUserMedia();
          setCompleted(false);
          setTranscript('');
          setGeneratedFeedback('');
          restartVideo();
        } else {
          updateInvitationStatus(invitationId, 'COMPLETED');
          setCompleted(true);
        }
      } else {
      }
    });
  };

  const handleStartCaptureClick = useCallback(() => {
    setUserButtonMessage('');
    const startTimer = document.getElementById('startTimer');
    if (startTimer) {
      startTimer.style.display = 'none';
    }

    if (vidRef.current) {
      vidRef.current.play();
    }
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleStopCaptureClick = useCallback(() => {
    setUserButtonMessage('');
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setCapturing(false);
  }, []);

  useEffect(() => {
    let timer: any = null;
    if (capturing) {
      timer = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
        setTotalSeconds((totalSeconds) => totalSeconds - 1);
      }, 1000);
      if (seconds === 0) {
        handleStopCaptureClick();
        setCapturing(false);
        setSeconds(0);
      }
    }
    return () => {
      clearInterval(timer);
    };
  });

  useEffect(() => {
    if (recordedChunks.length > 0 && !capturing) {
      handleDownload();
    }
  }, [recordedChunks]);

  const handleDownload = async () => {
    if (recordedChunks.length > 0) {
      setSubmitting(true);
      setStatus('Submitting');
      setUserButtonMessage('');
      const followUpLevel = (interviewQuestions[currentQuestionIndex] as any)
        ?.followUpDepth;

      if (currentFollowUpLevel < followUpLevel) {
        const selectedUrl = getRandomUrl();
        setAudioResponseLink(selectedUrl);
        setAudioResponseLinkEnd(false);
      }

      const file = new Blob(recordedChunks, {
        type: `video/webm`
      });

      const unique_id = uuid();

      if (ffmpeg.isLoaded() === false) {
        await ffmpeg.load();
      }

      ffmpeg.FS('writeFile', `${unique_id}.webm`, await fetchFile(file));

      await ffmpeg.run(
        '-i',
        `${unique_id}.webm`,
        '-vn',
        '-acodec',
        'libmp3lame',
        '-ac',
        '1',
        '-ar',
        '16000',
        '-f',
        'mp3',
        `${unique_id}.mp3`
      );

      const maxStartTime = Math.max(
        0,
        interviewTimePerQuestion - seconds - timeSlotDuration - 1
      );
      const randomStartTime = Math.floor(Math.random() * (maxStartTime + 1));
      const endTime =
        randomStartTime +
        Math.min(interviewTimePerQuestion - seconds, timeSlotDuration) -
        1;

      await ffmpeg.run(
        '-i',
        `${unique_id}.webm`,
        '-ss',
        `${randomStartTime}`,
        '-to',
        `${endTime}`,
        '-c:v',
        'copy',
        '-c:a',
        'copy',
        '-movflags',
        '+faststart', // Add this option
        `${unique_id}_video.mp4`
      );

      const videoFileData = ffmpeg.FS('readFile', `${unique_id}_video.mp4`);
      const video_output = new File(
        [videoFileData.buffer],
        `${unique_id}_video.mp4`,
        {
          type: 'video/webm'
        }
      );

      const formDataVideo = new FormData();
      formDataVideo.append(
        'video_file',
        video_output,
        `${unique_id}_video.webm`
      );

      const videoUploadPromise = fetchWithTimeout(
        `/api/video-upload?unique_id=${unique_id}`,
        {
          method: 'POST',
          body: formDataVideo
        }
      )
        .then((response) => response.json())
        .catch((error) => {
          console.error('Error processing or uploading video:', error);
          return null;
        });

      const fileData = ffmpeg.FS('readFile', `${unique_id}.mp3`);

      const output = new File([fileData.buffer], `${unique_id}.mp3`, {
        type: 'audio/mp3'
      });

      const formDataAudio = new FormData();
      formDataAudio.append('file', output, `${unique_id}.mp3`);

      const transcribePromise = fetch(
        `/api/transcribe?unique_id=${unique_id}
            &traits=${traits}
            &interviewId=${interviewId}
            &questionId=${questionId}
            &candidateId=${candidateId}
            &invitationId=${invitationId}
            &follow_up_level=${currentFollowUpLevel}
            &audio_question_text=${audioQuestionText}
            &audio_question_link=${audioQuestionLink}
            `,
        {
          method: 'POST',
          body: formDataAudio
        }
      ).then((response) => response.json());

      Promise.all([videoUploadPromise, transcribePromise]).then(
        ([resultsVideo, resultsAudio]) => {
          const videoStorageUrl = resultsVideo?.ok
            ? resultsVideo.storageUrl
            : '';

          const updateVideo = fetch(
            `/api/video-url-update?evaluation_id=${resultsAudio.evaluationId}
              &videoStorageUrl=${videoStorageUrl}
            `,
            {
              method: 'POST',
              body: formDataAudio
            }
          ).then((response) => response.json());

          updateVideo
            .then(async (updateVideo) => {
              if (updateVideo.ok) {
                if (resultsAudio.error) {
                  setTranscript(resultsAudio.error);
                } else {
                  setTranscript(resultsAudio.transcript);
                }
                if (resultsAudio.transcript.length > 0) {
                  setGeneratedFeedback('');
                  setIsSuccess(true);
                  setSubmitting(false);
                  let followUp = false;
                  try {
                    const followUpLevel = (
                      interviewQuestions[currentQuestionIndex] as any
                    )?.followUpDepth;
                    setIsSuccess(false);
                    setSubmitting(true);
                    setStatus('Preparing Next Question');

                    if (currentFollowUpLevel < followUpLevel) {
                      followUp = true;

                      try {
                        const followUpResponse = await fetch('/api/followup', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({
                            prompt: resultsAudio.transcript,
                            voice: interviewVoiceType,
                            followUpNumber: currentFollowUpLevel + 1,
                            uniqueId: invitationId
                          })
                        });

                        if (followUpResponse.ok) {
                          const followUpResponseJson =
                            await followUpResponse.json();
                          const followUpQuestion =
                            followUpResponseJson.followUpQuestion;
                          const audioStorageUrl =
                            followUpResponseJson.storageUrl;

                          setCurrentFollowUpLevel(currentFollowUpLevel + 1);
                          setAudioQuestionText(followUpQuestion);
                          setAudioQuestionLink(audioStorageUrl);
                        } else {
                          console.error('Follow up question failed');
                          setCurrentFollowUpLevel(0);
                          setCurrentQuestionIndex(currentQuestionIndex + 1);

                          setAudioQuestionText(
                            (
                              interviewQuestions[
                                currentQuestionIndex + 1
                              ] as any
                            )?.question
                          );
                          setAudioQuestionLink(
                            (
                              interviewQuestions[
                                currentQuestionIndex + 1
                              ] as any
                            )?.audioLink
                          );
                          setTraits(
                            (
                              interviewQuestions[
                                currentQuestionIndex + 1
                              ] as any
                            )?.traits
                          );
                          setQuestionId(
                            (
                              interviewQuestions[
                                currentQuestionIndex + 1
                              ] as any
                            )?.id
                          );
                        }
                      } catch (error) {
                        // Log error to a server-side logging service
                        axios.post('/api/log-error', { message: error.message });
                        // Handle the error according to your application's needs
                        // set next question
                        setCurrentFollowUpLevel(0);
                        setCurrentQuestionIndex(currentQuestionIndex + 1);

                        setAudioQuestionText(
                          (interviewQuestions[currentQuestionIndex + 1] as any)
                            ?.question
                        );
                        setAudioQuestionLink(
                          (interviewQuestions[currentQuestionIndex + 1] as any)
                            ?.audioLink
                        );
                        setTraits(
                          (interviewQuestions[currentQuestionIndex + 1] as any)
                            ?.traits
                        );
                        setQuestionId(
                          (interviewQuestions[currentQuestionIndex + 1] as any)
                            ?.id
                        );
                      }
                    } else {
                      setCurrentFollowUpLevel(0);
                      setCurrentQuestionIndex(currentQuestionIndex + 1);

                      setAudioQuestionText(
                        (interviewQuestions[currentQuestionIndex + 1] as any)
                          ?.question
                      );
                      setAudioQuestionLink(
                        (interviewQuestions[currentQuestionIndex + 1] as any)
                          ?.audioLink
                      );
                      setTraits(
                        (interviewQuestions[currentQuestionIndex + 1] as any)
                          ?.traits
                      );
                      setQuestionId(
                        (interviewQuestions[currentQuestionIndex + 1] as any)
                          ?.id
                      );
                    }

                    if (
                      followUp ||
                      currentQuestionIndex < interviewQuestions.length - 1
                    ) {
                      setStatus('Submitted');
                      setLoading(true);
                      setCapturing(false);
                      setRecordedChunks([]);
                      setSeconds(120);
                      setAudioEnded(false);
                      setRecordingPermission(true);
                      setCameraLoaded(false);
                      setSubmitting(false);
                      setIsSuccess(false);
                      setIsVisible(true);
                      setIsDesktop(window.innerWidth >= 768);
                      gradient.initGradient('#gradient-canvas');
                      handleUserMedia();
                      setCompleted(false);
                      setTranscript('');
                      setGeneratedFeedback('');
                      setAudioResponseLink('');
                      setAudioResponseLinkEnd(true);
                      restartVideo();
                      setUserButtonMessage('Speak Up, then Submit');
                    } else {
                      console.log('Interview completed');
                      updateInvitationStatus(invitationId, 'COMPLETED');
                      setCompleted(true);
                    }
                  } catch (error) {
                    console.error('Error creating evaluation:', error);
                  }
                } else {
                  console.log('No transcript found');
                  if (currentQuestionIndex < interviewQuestions.length) {
                    // Update the state with the next question or ask next question in follow up
                  } else {
                    updateInvitationStatus(invitationId, 'COMPLETED');
                    setCompleted(true);
                  }
                }
              } else {
                console.error('Upload failed.');
              }
            })
            .catch((error) => {
              console.error('Error during parallel processing:', error);
            });
        }
      );

      setTimeout(function () {
        setRecordedChunks([]);
      }, 1200);
    }
  };

  function restartVideo() {
    setRecordedChunks([]);
    setAudioEnded(false);
    setCapturing(false);
    setIsVisible(true);
  }

  const videoConstraints = isDesktop
    ? { width: 1280, height: 720, facingMode: 'user' }
    : { width: 480, height: 640, facingMode: 'user' };

  const handleUserMedia = () => {
    setTimeout(() => {
      setLoading(false);
      setCameraLoaded(true);
    }, 1000);
  };

  const updateInvitationStatus = async (
    invitationIdPk: number,
    status: string
  ) => {
    try {
      if (!invitationIdPk) {
        return;
      }

      const response = await axios.put(`/api/invitation/${invitationIdPk}`, {
        invitationIdPk,
        status
      });
      await response.data;
      if (status.toLowerCase() === 'completed') {
        setTemplate(`
          Summarize the evaluation of the candidate for the role of ${interviewRole} at ${interviewCompany} on the following criterias:
          - Problem solving skills
          - Communication skills
          - Leadership skills
          - Teamwork skills
          - Technical skills
        `);
        if (candidateId > 0 && invitationId > 0) {
          axios.post(
            `/api/summary`,
            {
              candidateId: candidateId,
              invitationId: invitationId,
              template: template,
              max_words: 140
            },
            {
              timeout: 60000 // Timeout in milliseconds
            }
          );
        }
      }
    } catch (error) {
      console.error('Error updating invitation status:', error);
    }
  };

  const handleContinueButtonSubmit = async () => {
    if (id) {
      setUserPressedContinue(true);
      setIsLoading(true);

      // This checks if ffmpeg is loaded
      if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
      }

      try {
        const response = await fetch(
          `/api/public-interview?interviewId=${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        if (response.ok) {
          const invitation = await response.json();
          if (invitation.status === 'INACTIVE') {
            console.error('Invitation is no longer active.');
          } else {
            if (invitation.pinCode) {
              setIsLoading(false);
              setUser(invitation.candidate.name);
              setInterviewRole(invitation.interview.jobRoleName);
              setInterviewCompany(invitation.interview.jobAtCompany);
              setInterviewId(invitation.interview.id);
              setInterviewIdHexCode(invitation.interview.interviewId);
              setCandidateId(invitation.candidate.id);
              setInvitationId(invitation.id);
              setInterviewVoiceType(invitation.interview.interviewVoiceType);
              setTotalSeconds(invitation.interview.durationInMinutes * 60);
              await updateInvitationStatus(invitation.id, 'STARTED');
              try {
                const response = await axios.get(
                  `/api/interviews?interviewId=${invitation.interviewId}`
                );
                const invitationIdPK = response.data[0].interviewId;
                if (invitationIdPK !== undefined) {
                  const response = await fetch(
                    `/api/questions?interviewIdPk=${invitation.interview.id}&invitationId=${invitation.invitationId}&interviewId=${invitation.interview.interviewId}`,
                    {
                      method: 'GET',
                      headers: {
                        'Content-Type': 'application/json'
                      }
                    }
                  );
                  if (!response.ok) {
                    throw new Error('Failed to fetch questions');
                  }
                  setInterviewId(invitation.interviewId);
                  const questions = await response.json();

                  if (response.ok) {
                    if (questions.length === 0) {
                      await updateInvitationStatus(invitation.id, 'COMPLETED');
                      setCompleted(true);
                    } else {
                      setInterviewQuestions(
                        questions.map((question: string) => question)
                      );
                      setAudioQuestionText(
                        questions[currentQuestionIndex].question
                      );
                      setAudioQuestionLink(
                        questions[currentQuestionIndex].audioLink
                      );
                      setTraits(questions[currentQuestionIndex].traits);
                      setQuestionId(questions[currentQuestionIndex].id);
                    }
                  }
                }
              } catch (error) {
                console.error('Error fetching questions:', error);
              }
            } else {
            }
          }
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    }
  };

  return (
    <div>
      {userPressedContinue ? (
        <AnimatePresence>
          <div className="p-4 md:p-10 mx-auto max-w-7xl flex flex-col px-2 pt-2 pb-2 md:px-2 md:py-2 relative overflow-x-hidden">
            <span className="text-sm" style={{ textAlign: 'center' }}>
              {!completed && user !== '' ? (
                <motion.div
                  className="bg-white rounded-lg p-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="interview-info bg-white rounded-lg px-6 py-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Welcome{' '}
                      <span className="text-blue-600 capitalize">{user}</span>,
                    </h2>
                    <p className="text-lg mt-1 text-gray-800">
                      You are interviewing for the role of
                      <span className="text-blue-600 capitalize">
                        {' '}
                        {interviewRole}
                      </span>{' '}
                      at{' '}
                      <span className="text-blue-600 capitalize">
                        {interviewCompany}
                      </span>
                      .
                    </p>

                    <div className="mt-2">
                      <p className="question-info text-gray-700">
                        Current Question:{' '}
                        <span className="font-bold text-gray-900">
                          {currentQuestionIndex + 1}
                        </span>
                        · Follow-Up Question:{' '}
                        <span className="font-bold text-gray-900">
                          {currentFollowUpLevel} /{' '}
                          {
                            (interviewQuestions[currentQuestionIndex] as any)
                              ?.followUpDepth
                          }
                        </span>
                        · Total Questions:{' '}
                        <span className="font-bold text-gray-900">
                          {interviewQuestions.length}
                        </span>
                      </p>
                      <p className="question-info text-gray-700">
                        Total remaining time:
                        <span className="font-semibold">
                          {' '}
                          {new Date(totalSeconds * 1000)
                            .toISOString()
                            .slice(14, 19)}{' '}
                          min
                        </span>
                        · Current Question Remaining time:
                        <span className="font-semibold">
                          {' '}
                          {new Date(seconds * 1000)
                            .toISOString()
                            .slice(14, 19)}{' '}
                          min
                        </span>
                      </p>
                    </div>

                    <p className="text-gray-600 mt-3 italic">
                      Press submit after answering the question.
                    </p>
                  </div>

                  {audioResponseLink && (
                    <div className="block absolute top-[-10px] sm:top-[-20px] lg:top-[-40px] left-auto right-[10px] sm:right-[20px] md:right-10 h-[20px] sm:h-[100px] md:h-[100px] aspect-video rounded z-20">
                      <div className="h-full w-full aspect-video rounded md:rounded-lg lg:rounded-xl">
                        <audio
                          autoPlay
                          id="answer-response-audio"
                          onEnded={() => setAudioResponseLinkEnd(true)}
                          className="h-full object-cover w-full rounded-md md:rounded-[12px] aspect-video"
                          crossOrigin="anonymous"
                        >
                          <source
                            src={`/api/audio-proxy?audioLink=${encodeURIComponent(
                              audioResponseLink
                            )}`}
                            type="audio/mpeg"
                          />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : user !== '' ? (
                <div className="bg-[#FCFCFC] p-4 md:p-10 mx-auto max-w