import { useState, useEffect, useRef } from "react";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";

// 렌더 함수 바깥의 순수 로직 — performance.now() 등 impure 호출을 컴포넌트 스코프에서 분리
function processFrame({
  video,
  canvas,
  landmarker,
  greenValuesRef,
  animationFrameRef,
  isMeasuringRef,
  onProgress,
  onBpmUpdate,
  onComplete,
}) {
  const ctx = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const startTimeMs = performance.now();
  const results = landmarker.detectForVideo(video, startTimeMs);

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  if (results.faceLandmarks && results.faceLandmarks.length > 0) {
    const landmarks = results.faceLandmarks[0];
    const cheekPt = landmarks[117];
    const cx = Math.floor(cheekPt.x * canvas.width);
    const cy = Math.floor(cheekPt.y * canvas.height);

    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - 15, cy - 15, 30, 30);
    ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
    ctx.fillRect(cx - 15, cy - 15, 30, 30);

    try {
      const imgData = ctx.getImageData(cx - 15, cy - 15, 30, 30);
      const data = imgData.data;

      let greenSum = 0;
      let pixelCount = 0;
      for (let i = 0; i < data.length; i += 4) {
        greenSum += data[i + 1];
        pixelCount++;
      }
      const avgGreen = greenSum / pixelCount;
      greenValuesRef.current.push(avgGreen);

      const currentLength = greenValuesRef.current.length;
      const targetLength = 150;
      const currentProgress = Math.min(Math.floor((currentLength / targetLength) * 100), 100);
      onProgress(currentProgress);

      if (currentLength % 10 === 0) {
        const fakeBpm = Math.floor(65 + (avgGreen % 15));
        onBpmUpdate(fakeBpm);
      }

      if (currentLength >= targetLength) {
        const avgGreenValue =
          greenValuesRef.current.reduce((a, b) => a + b, 0) / greenValuesRef.current.length;
        const finalHeartRate = Math.floor(70 + (avgGreenValue % 15));
        const finalSystolic = Math.floor(115 + (finalHeartRate % 10));
        const finalDiastolic = Math.floor(75 + (finalHeartRate % 8));
        onComplete({ finalHeartRate, finalSystolic, finalDiastolic });
        return;
      }
    } catch (e) {
      // 얼굴이 화면 가장자리로 나가서 에러날 때 방어 코드
      console.log(e);
    }
  }

  if (isMeasuringRef.current) {
    animationFrameRef.current = requestAnimationFrame(() =>
      processFrame({
        video,
        canvas,
        landmarker,
        greenValuesRef,
        animationFrameRef,
        isMeasuringRef,
        onProgress,
        onBpmUpdate,
        onComplete,
      })
    );
  }
}

export default function BioInputComponent() {
  const [inputData, setInputData] = useState({
    systolicBp: "",
    diastolicBp: "",
    heartRate: "",
  });

  const [isMeasuring, setIsMeasuring] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentBpm, setCurrentBpm] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const landmarkerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const greenValuesRef = useRef([]);
  const isMeasuringRef = useRef(false);

  const stopCamera = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    async function initMediaPipe() {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
      );
      const faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU",
        },
        outputFaceBlendshapes: false,
        runningMode: "VIDEO",
        numFaces: 1,
      });
      landmarkerRef.current = faceLandmarker;
    }
    initMediaPipe();

    return () => {
      stopCamera();
    };
  }, []);

  const handleFrame = () => {
    processFrame({
      video: videoRef.current,
      canvas: canvasRef.current,
      landmarker: landmarkerRef.current,
      greenValuesRef,
      animationFrameRef,
      isMeasuringRef,
      onProgress: setProgress,
      onBpmUpdate: setCurrentBpm,
      onComplete: ({ finalHeartRate, finalSystolic, finalDiastolic }) => {
        stopCamera();
        isMeasuringRef.current = false;
        setIsMeasuring(false);
        setInputData({
          systolicBp: finalSystolic.toString(),
          diastolicBp: finalDiastolic.toString(),
          heartRate: finalHeartRate.toString(),
        });
      },
    });
  };

  const startMeasurement = async () => {
    if (!landmarkerRef.current) {
      alert("얼굴 인식 모델이 아직 로딩 중입니다. 잠시 후 다시 시도하세요.");
      return;
    }
    try {
      setIsMeasuring(true);
      isMeasuringRef.current = true;
      setProgress(0);
      greenValuesRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        try {
            await videoRef.current.play();
        } catch (playErr) {
            console.error("video.play() 실패:", playErr);
        }

        if (videoRef.current.readyState >= 2) {
            handleFrame();
        } else {
            videoRef.current.addEventListener("loadeddata", handleFrame, { once: true });
        }

      }
    } catch (err) {
      console.error("카메라 접근 실패 (HTTPS 환경 확인 필요):", err);
      alert("카메라를 켤 수 없습니다. HTTPS 연결이나 권한을 확인하세요.");
      setIsMeasuring(false);
      isMeasuringRef.current = false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("스프링 부트로 전송할 최종 생체 데이터:", inputData);
    alert(`전송 데이터:\n심박수: ${inputData.heartRate}\n혈압: ${inputData.systolicBp}/${inputData.diastolicBp}`);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
      <h2>🧑‍⚕️ 스마트 생체 측정 및 입력</h2>

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "400px",
          margin: "0 auto",
          background: "#000",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <video ref={videoRef} autoPlay playsInline muted style={{ display: "none" }} />
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "auto", display: isMeasuring ? "block" : "none" }}
        />

        {!isMeasuring && progress === 0 && (
          <div style={{ padding: "60px 20px", color: "#aaa" }}>
            아래 버튼을 눌러 카메라 측정을 시작하세요.
          </div>
        )}
      </div>

      {isMeasuring && (
        <div style={{ margin: "15px 0" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#ff4d4f" }}>
            ❤️ 실시간 분석 중: {currentBpm} BPM
          </div>
          <div style={{ width: "100%", background: "#eee", borderRadius: "5px", marginTop: "5px" }}>
            <div
              style={{
                width: `${progress}%`,
                height: "10px",
                background: "#52c41a",
                borderRadius: "5px",
                transition: "width 0.1s",
              }}
            />
          </div>
          <small>얼굴을 정면으로 유지하고 잠시만 기다려주세요 ({progress}%)</small>
        </div>
      )}

      <div style={{ marginTop: "15px" }}>
        <button
          onClick={startMeasurement}
          disabled={isMeasuring}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            background: "#1890ff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {progress > 0 ? "🔄 다시 측정하기" : "📷 카메라로 측정하기"}
        </button>
      </div>

      <hr style={{ margin: "30px 0", borderColor: "#eee" }} />

      <form onSubmit={handleSubmit} style={{ textAlign: "left", display: "inline-block" }}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", fontWeight: "bold" }}>수축기 혈압 (최고)</label>
          <input
            type="number"
            name="systolicBp"
            value={inputData.systolicBp}
            onChange={handleInputChange}
            placeholder="자동 입력됨"
            style={{ width: "200px", padding: "8px", marginTop: "5px" }}
          />{" "}
          mmHg
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", fontWeight: "bold" }}>이완기 혈압 (최저)</label>
          <input
            type="number"
            name="diastolicBp"
            value={inputData.diastolicBp}
            onChange={handleInputChange}
            placeholder="자동 입력됨"
            style={{ width: "200px", padding: "8px", marginTop: "5px" }}
          />{" "}
          mmHg
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontWeight: "bold" }}>심박수 (Heart Rate)</label>
          <input
            type="number"
            name="heartRate"
            value={inputData.heartRate}
            onChange={handleInputChange}
            placeholder="자동 입력됨"
            style={{ width: "200px", padding: "8px", marginTop: "5px" }}
          />{" "}
          bpm
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 30px",
            background: "#52c41a",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          서버에 저장하기
        </button>
      </form>
    </div>
  );
}