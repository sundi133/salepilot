import Webcam from 'react-webcam';
import { AnimatePresence, motion } from 'framer-motion';
import { RadioGroup } from '@headlessui/react';
import { v4 as uuid } from 'uuid';
import Link from 'next/link';
import { useRef, useState, useEffect, useCallback } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import '../../app/css/globals.css';
import { Button } from '@tremor/react';
import { useRouter } from 'next/router';
import { gradient } from '../../components/gradient';
import axios from 'axios'; // You need to install axios if not already installed

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
  const [interviewRole, setInterviewRole] = useState('Software Engineer');
  const [interviewCompany, setInterviewCompany] = useState('Google');
  const [user, setUser] = useState('John Doe');
  const [pinCode, setPinCode] = useState('');
  const [isValidPin, setIsValidPin] = useState(false); // Add this state
  const [pinCodeButtonSubmitted, setPinCodeButtonSubmitted] = useState('');
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [valiedPinCode, setValidPinCode] = useState('');
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

  const editorOptions: any = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line',
    automaticLayout: true,
    glyphMargin: true,
    lineNumbersMinChars: 3,
    theme: 'vs-light',
    wordWrap: 'on',
    wrappingIndent: 'indent',
    wordWrapColumn: 80,
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    renderLineHighlight: 'all',
    scrollbar: {
      vertical: 'hidden',
      horizontal: 'hidden',
      verticalScrollbarSize: 0,
      horizontalScrollbarSize: 0
    },
    alignItems: 'left'
  };

  const getRandomUrl = () => {
    const randomIndex = Math.floor(Math.random() * urls.length);
    return urls[randomIndex];
  };

  const [codeString, setCodeString] = useState(``);

  const handleChange = (newValue: string) => {
    setCodeString(newValue);
  };

  const handleGoBack = () => {
    router.push('/');
  };

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

      // This checks if ffmpeg is loaded
      if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
      }

      await ffmpeg.FS('writeFile', `${unique_id}.webm`, await fetchFile(file));

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
                        console.error('An error occurred:', error);
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
    } catch (error) {
      console.error('Error updating invitation status:', error);
    }
  };

  const handlePinCodeSubmit = async () => {
    if (id) {
      setIsLoading(true);

      try {
        const response = await fetch(`/api/pincode?invitationId=${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        if (response.ok) {
          const invitation = await response.json();
          if (invitation.status === 'INACTIVE') {
            console.error('Invitation is no longer active.');
          } else {
            setValidPinCode(invitation.pinCode);
            if (pinCode === invitation.pinCode) {
              setIsLoading(false);
              setIsValidPin(true);
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
                    `/api/questions?interviewIdPk=${invitation.interviewId}&invitationId=${id}&interviewId=${invitation.interview.interviewId}`,
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
              setIsValidPin(false);
              setPinCodeButtonSubmitted('Invalid Pin Code, please try again.');
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
      {isValidPin ? (
        <AnimatePresence>
          <div className="p-4 md:p-10 mx-auto max-w-7xl flex flex-col px-2 pt-2 pb-2 md:px-2 md:py-2 relative overflow-x-hidden">
            <span className="container text-sm" style={{ textAlign: 'center' }}>
              {!completed ? (
                <motion.div
                  className="interview-container bg-white rounded-lg p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="interview-info bg-white rounded-lg shadow px-6 py-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Welcome{' '}
                      <span className="text-blue-600 capitalize">{user}</span>,
                    </h2>
                    <p className="text-lg mt-1 text-gray-800">
                      You are interviewing for the role of
                      <span className="text-blue-600 capitalize">
                        {interviewRole}
                      </span>{' '}
                      at{' '}
                      <span className="text-blue-600 capitalize">
                        {interviewCompany}
                      </span>
                      .
                    </p>

                    <div className="mt-4">
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
              ) : (
                <div className="bg-[#FCFCFC] p-4 md:p-10 mx-auto max-w-7xl flex flex-col">
                  <div className="w-[800px] mx-auto">
                    <motion.div className="interview-container">
                      <h4 className="text-xl font-semibold text-[#1D2B3A] mb-2"></h4>
                      {/* TODO(@sundi133) add a video thank you message */}
                      <span className="text-large">
                        Thank you{' '}
                        <span className="font-semibold capitalize">{user}</span>{' '}
                        for your dedication, time and interest in this role. The
                        interview is now complete.
                      </span>
                      <p className="text-xl mt-2">
                        Stay tuned to hear back from us soon.
                      </p>

                      <p className="text-sm mt-2">
                        Please use &nbsp;
                        <Link
                          href="https://forms.gle/FMQJYBHEeTJm6EFNA"
                          target="_blank"
                        >
                          <span className="text-blue-500 hover:text-blue-500">
                            this link
                          </span>
                        </Link>
                        &nbsp; to provide any feedback on your experience.
                      </p>
                    </motion.div>
                  </div>
                </div>
              )}
            </span>
            {completed ? (
              <div className="w-full flex flex-col max-w-[1080px] mx-auto overflow-y-auto pb-8 md:pb-12"></div>
            ) : (
              <div className="h-full w-full items-center flex flex-col">
                {recordingPermission ? (
                  <div className="w-full flex flex-col max-w-[1080px] mx-auto justify-start">
                    <div className="container text-l font-medium text-gray-900 mb-2"></div>
                    <span className="text-[14px] leading-[20px] text-[#1a2b3b] font-normal mb-4">
                      {/* Question : {audioQuestionText} */}
                    </span>
                    <motion.div
                      initial={{ y: -20 }}
                      animate={{ y: 0 }}
                      transition={{
                        duration: 0.35,
                        ease: [0.075, 0.82, 0.965, 1]
                      }}
                      className="relative aspect-[16/9] w-full max-w-[1080px] overflow-hidden bg-[#1D2B3A] rounded-lg ring-1 ring-gray-900/5 shadow-md"
                    >
                      {!cameraLoaded && (
                        <div className="text-white absolute top-1/2 left-1/2 z-20 flex items-center">
                          <svg
                            className="animate-spin h-4 w-4 text-white mx-auto my-0.5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth={3}
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </div>
                      )}
                      <div className="relative z-10 h-full w-full rounded-lg">
                        {/* <div className="absolute top-2 lg:top-4 left-2 lg:left-4 z-20">
                          <span className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-white text-[#1E2B3A] hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] no-underline flex gap-x-2  active:scale-95 scale-100 duration-75">
                            Remaining time -{' '}
                            {new Date(seconds * 1000)
                              .toISOString()
                              .slice(14, 19)}{' '}
                            min
                          </span>
                        </div> */}
                        {isVisible &&
                          audioResponseLinkEnd &&
                          audioQuestionLink && ( // If the video is visible (on screen) we show it
                            <div className="block absolute top-[-10px] sm:top-[-20px] lg:top-[-40px] left-auto right-[10px] sm:right-[20px] md:right-10 h-[20px] sm:h-[100px] md:h-[100px] aspect-video rounded z-20">
                              <div className="h-full w-full aspect-video rounded md:rounded-lg lg:rounded-xl">
                                <audio
                                  autoPlay
                                  id="question-audio"
                                  onEnded={() => setAudioEnded(true)}
                                  ref={vidRef}
                                  className="h-full object-cover w-full rounded-md md:rounded-[12px] aspect-video"
                                  crossOrigin="anonymous"
                                >
                                  <source
                                    src={`/api/audio-proxy?audioLink=${encodeURIComponent(
                                      audioQuestionLink
                                    )}`}
                                    type="audio/mpeg"
                                  />
                                  Your browser does not support the audio
                                  element.
                                </audio>
                              </div>
                            </div>
                          )}
                        <Webcam
                          mirrored
                          audio
                          muted
                          ref={webcamRef}
                          videoConstraints={videoConstraints}
                          onUserMedia={handleUserMedia}
                          onUserMediaError={(error) => {
                            console.error('Error accessing user media:', error);
                            setRecordingPermission(false);
                          }}
                          className="absolute z-10 min-h-[100%] min-w-[100%] h-auto w-auto object-cover"
                        />
                      </div>
                      {loading && (
                        <div className="absolute flex h-full w-full items-center justify-center">
                          <div className="relative h-[112px] w-[112px] rounded-lg object-cover text-[2rem]">
                            <div className="flex h-[112px] w-[112px] items-center justify-center rounded-[0.5rem] bg-[#4171d8] !text-white">
                              Loading...
                            </div>
                          </div>
                        </div>
                      )}

                      {cameraLoaded && (
                        <div className="absolute bottom-0 left-0 z-50 flex h-[82px] w-full items-center justify-center">
                          <div className="absolute bottom-[6px] md:bottom-5 left-5 right-5">
                            <div className="lg:mt-4 flex flex-col items-center justify-center gap-2">
                              {capturing ? (
                                <span className="text-sm text-white whitespace-nowrap font-bold text-center">
                                  {userButtonMessage}
                                </span>
                              ) : (
                                <></>
                              )}

                              {capturing ? (
                                <div className="lg:mt-4 flex flex-row items-center justify-center gap-2">
                                  <Button
                                    onClick={skipQuestion}
                                    className="group rounded-full min-w-[140px] px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-gray-900 text-white hover:bg-white hover:text-gray-900 no-underline flex  active:scale-95 scale-100 duration-75  disabled:cursor-not-allowed border border-gray-300 hover:border hover:border-gray-300"
                                    type="button"
                                    disabled={isSubmitting}
                                  >
                                    Skip
                                  </Button>
                                  <Button
                                    id="stopTimer"
                                    onClick={restartVideo}
                                    className="group rounded-full min-w-[140px] px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-gray-900 text-white hover:bg-white hover:text-gray-900 no-underline flex  active:scale-95 scale-100 duration-75  disabled:cursor-not-allowed border border-gray-300 hover:border hover:border-gray-300"
                                    type="button"
                                    disabled={isSubmitting}
                                  >
                                    Repeat
                                  </Button>
                                  <Button
                                    onClick={handleStopCaptureClick}
                                    disabled={isSubmitting}
                                    className="group rounded-full min-w-[140px] px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-gray-900 text-white hover:bg-white hover:text-gray-900 no-underline flex  active:scale-95 scale-100 duration-75  disabled:cursor-not-allowed border border-gray-300 hover:border hover:border-gray-300"
                                    type="button"
                                  >
                                    <span>
                                      {isSubmitting ? (
                                        <div className="flex items-center justify-center gap-x-2">
                                          <svg
                                            className="animate-spin h-5 w-5 text-slate-50 mx-auto"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                          >
                                            <circle
                                              className="opacity-25"
                                              cx="12"
                                              cy="12"
                                              r="10"
                                              stroke="currentColor"
                                              strokeWidth={3}
                                            ></circle>
                                            <path
                                              className="opacity-75"
                                              fill="currentColor"
                                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                          </svg>
                                          <span>{status}</span>
                                        </div>
                                      ) : (
                                        <div className="flex items-center justify-center gap-x-2">
                                          <span>Submit</span>
                                          <svg
                                            className="w-5 h-5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              d="M13.75 6.75L19.25 12L13.75 17.25"
                                              stroke="white"
                                              strokeWidth="1.5"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeOpacity="1"
                                              onMouseOver={(e) =>
                                                e.currentTarget.setAttribute(
                                                  'stroke',
                                                  'white'
                                                )
                                              }
                                              onMouseOut={(e) =>
                                                e.currentTarget.setAttribute(
                                                  'stroke',
                                                  'black'
                                                )
                                              }
                                            />
                                            <path
                                              d="M19 12H4.75"
                                              stroke="white"
                                              strokeWidth="1.5"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeOpacity="1"
                                              onMouseOver={(e) =>
                                                e.currentTarget.setAttribute(
                                                  'stroke',
                                                  'white'
                                                )
                                              }
                                              onMouseOut={(e) =>
                                                e.currentTarget.setAttribute(
                                                  'stroke',
                                                  'black'
                                                )
                                              }
                                            />
                                          </svg>
                                        </div>
                                      )}
                                    </span>
                                  </Button>
                                </div>
                              ) : isSuccess ? (
                                <button
                                  className="cursor-disabled group rounded-full min-w-[140px] px-4 py-2 text-[13px] font-semibold group inline-flex items-center justify-center text-sm text-white duration-120 bg-green-500 hover:bg-green-600 hover:text-slate-100 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 active:scale-100 active:bg-green-800 active:text-green-100"
                                  style={{
                                    boxShadow:
                                      '0px 1px 4px rgba(27, 71, 13, 0.17), inset 0px 0px 0px 1px #5fc767, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)'
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mx-auto"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                  >
                                    <motion.path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                      initial={{ pathLength: 0 }}
                                      animate={{ pathLength: 1 }}
                                      transition={{ duration: 0.5 }}
                                    />
                                  </svg>
                                </button>
                              ) : isSubmitting ? (
                                <div className="flex items-center justify-center gap-x-2">
                                  <svg
                                    className="animate-spin h-5 w-5 text-slate-50 mx-auto"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth={3}
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  <span className="inline-block px-3 py-1 mr-2 text-sm font-semibold text-white bg-green-500 border border-dark rounded-md hover:bg-gray-700 hover:border-gray-700">
                                    {status}
                                  </span>
                                </div>
                              ) : (
                                <></>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      <div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-5xl text-white font-semibold text-center"
                        id="countdown"
                      ></div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.5,
                        duration: 0.15,
                        ease: [0.23, 1, 0.82, 1]
                      }}
                      className="flex flex-row space-x-1 mt-4 items-center"
                    ></motion.div>
                  </div>
                ) : (
                  <div className="w-full flex flex-col max-w-[1080px] mx-auto justify-center">
                    <motion.div
                      initial={{ y: 20 }}
                      animate={{ y: 0 }}
                      transition={{
                        duration: 0.35,
                        ease: [0.075, 0.82, 0.165, 1]
                      }}
                      className="relative md:aspect-[16/9] w-full max-w-[1080px] overflow-hidden bg-[#1D2B3A] rounded-lg ring-1 ring-gray-900/5 shadow-md flex flex-col items-center justify-center"
                    >
                      <p className="text-white font-medium text-sm text-center max-w-3xl">
                        Camera permission is denied. Try again by after enabling
                        permissions in your browser settings and refresh your
                        page.
                      </p>
                    </motion.div>
                    <div className="flex flex-row space-x-4 mt-8 justify-end"></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </AnimatePresence>
      ) : (
        <AnimatePresence>
          <div className="w-full min-h-screen flex flex-col justify-center items-center bg-[#FCFCFC] relative overflow-x-hidden">
            <h2 className="text-l font-semibold text-[#1D2B3A] mb-4 text-center"></h2>
            <div className="w-[400px] mx-auto">
              <input
                type="text"
                placeholder="Enter pin code here to start the interview"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                className="w-full p-2 mb-2 border border-gray-300 rounded-md text-center"
              />
              <button
                onClick={handlePinCodeSubmit}
                className="w-full bg-gray-900 text-white rounded-md py-2 hover:bg-gray-700"
              >
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin h-6 w-6 border-t-4 border-white rounded-full"></div>
                  </div>
                )}
                Continue
              </button>
            </div>
            <p className="text-red-500 py-2">{pinCodeButtonSubmitted}</p>

            <h4 className="text-left text-sm font-small text-[#1D2B3A] mb-4">
              <p>
                Please ensure camera is enabled on next page, your network
                connection is stable and you are in a quiet environment. Works
                best on Chrome and Firefox.
              </p>
            </h4>
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default InterviewQuestionRecorder;
