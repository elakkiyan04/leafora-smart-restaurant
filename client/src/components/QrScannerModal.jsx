import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservation } from '../context/ReservationContext';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const QrScannerModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { reservations } = useReservation();
  
  const qrCodeRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [error, setError] = useState('');
  const [cameras, setCameras] = useState([]);
  const [activeCameraId, setActiveCameraId] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  // Initialize and start the scanner
  useEffect(() => {
    let html5QrCode;

    const initScanner = async () => {
      try {
        setError('');
        const devices = await Html5Qrcode.getCameras();
        setCameras(devices);

        if (devices.length === 0) {
          setError('No camera devices found.');
          setHasPermission(true);
          return;
        }

        setHasPermission(true);
        html5QrCode = new Html5Qrcode("reader");
        qrCodeRef.current = html5QrCode;

        // Default to back camera if available, otherwise first camera
        const backCam = devices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('environment')
        );
        const targetCameraId = backCam ? backCam.id : devices[0].id;
        setActiveCameraId(targetCameraId);

        await startScanning(html5QrCode, targetCameraId);
      } catch (err) {
        console.error('Camera initialization failed', err);
        setHasPermission(false);
        setError('Camera permission denied. Please allow camera access in your browser settings.');
      }
    };

    if (isOpen) {
      // Delay slightly to ensure reader div is mounted in the DOM
      const timer = setTimeout(() => {
        initScanner();
      }, 300);

      return () => {
        clearTimeout(timer);
        stopScanning();
      };
    }
  }, [isOpen]);

  const startScanning = async (scanner, cameraId) => {
    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }

      setIsScanning(true);
      await scanner.start(
        cameraId,
        {
          fps: 10,
          qrbox: (width, height) => {
            const size = Math.min(width, height) * 0.7;
            return { width: size, height: size };
          }
        },
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Silent scan failures
        }
      );
    } catch (err) {
      console.error('Failed to start scanning', err);
      setError('Failed to start the camera stream. Please try again.');
      setIsScanning(false);
    }
  };

  const stopScanning = async () => {
    if (qrCodeRef.current) {
      try {
        if (qrCodeRef.current.isScanning) {
          await qrCodeRef.current.stop();
        }
      } catch (err) {
        console.error('Error stopping scanner', err);
      } finally {
        setIsScanning(false);
      }
    }
  };

  const handleCameraChange = async (e) => {
    const newCameraId = e.target.value;
    setActiveCameraId(newCameraId);
    if (qrCodeRef.current) {
      await startScanning(qrCodeRef.current, newCameraId);
    }
  };

  const handleScanSuccess = async (decodedText) => {
    // Stop scanning immediately to prevent duplicate triggers
    await stopScanning();

    let table = '';
    let reservationId = '';

    try {
      if (decodedText.startsWith('http') || decodedText.includes('?')) {
        const url = new URL(decodedText.startsWith('http') ? decodedText : `${window.location.origin}${decodedText.startsWith('/') ? '' : '/'}${decodedText}`);
        table = url.searchParams.get('table');
        reservationId = url.searchParams.get('reservation');
      } else {
        const params = new URLSearchParams(decodedText);
        table = params.get('table');
        reservationId = params.get('reservation');
      }
    } catch (e) {
      // Parse query string directly if URL parsing failed
      try {
        const params = new URLSearchParams(decodedText.includes('?') ? decodedText.split('?')[1] : decodedText);
        table = params.get('table');
        reservationId = params.get('reservation');
      } catch (err) {
        // Fallback to treat raw text as table ID
        if (decodedText && decodedText.length < 10) {
          table = decodedText.trim();
        }
      }
    }

    if (!table) {
      toast.error('Invalid QR Code. No table identifier found.');
      // Restart scanning after a delay
      setTimeout(() => {
        if (isOpen && qrCodeRef.current) {
          startScanning(qrCodeRef.current, activeCameraId);
        }
      }, 2000);
      return;
    }

    // Validate the reservation status if reservation ID is scanned
    if (reservationId) {
      const foundRes = reservations.find(r => r.id === reservationId);
      if (!foundRes) {
        toast.error(`Invalid QR Code. Reservation #${reservationId} not found.`);
        restartScannerWithDelay();
        return;
      }
      
      if (foundRes.status === 'Completed' || foundRes.status === 'Cancelled' || foundRes.status === 'Expired') {
        toast.error(`This reservation #${reservationId} has already been ${foundRes.status.toLowerCase()}.`);
        restartScannerWithDelay();
        return;
      }

      if ((foundRes.allocatedTable || '').trim().toLowerCase() !== table.trim().toLowerCase()) {
        toast.error(`Table mismatch. Reservation is for Table ${foundRes.allocatedTable}, but scanned Table ${table}.`);
        restartScannerWithDelay();
        return;
      }
    } else {
      // If no reservation ID in QR, check if there is an active reservation for this table
      const activeRes = reservations.find(r => r.allocatedTable === table && r.status === 'Confirmed');
      if (activeRes) {
        reservationId = activeRes.id;
      }
    }

    // Success redirect
    toast.success(`Table ${table} scanned successfully! Redirecting...`, { icon: '🍃' });
    onClose();
    
    if (reservationId) {
      navigate(`/qr-landing?table=${table}&reservation=${reservationId}`);
    } else {
      navigate(`/qr-landing?table=${table}`);
    }
  };

  const restartScannerWithDelay = () => {
    setTimeout(() => {
      if (isOpen && qrCodeRef.current) {
        startScanning(qrCodeRef.current, activeCameraId);
      }
    }, 2500);
  };

  const handleClose = async () => {
    await stopScanning();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[999] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#111] border border-white/10 w-full max-w-md rounded-[2.5rem] overflow-hidden relative shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-serif font-black text-white italic tracking-wide">
              Scan Table QR Code
            </h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
              Access digital menu & ordering
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scanner view */}
        <div className="p-6 flex-1 flex flex-col items-center justify-center">
          <div className="w-full aspect-square bg-[#050505] relative rounded-[2rem] overflow-hidden border border-white/5 flex items-center justify-center">
            {hasPermission === false ? (
              <div className="p-6 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-4 animate-bounce">
                  <AlertCircle size={28} />
                </div>
                <p className="text-sm font-bold text-white mb-2">Camera Access Denied</p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Please enable camera permissions in your browser or device settings to scan restaurant QR codes.
                </p>
              </div>
            ) : error ? (
              <div className="p-6 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 mb-4">
                  <Camera size={28} />
                </div>
                <p className="text-sm font-bold text-white mb-2">Scanner Offline</p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {error}
                </p>
              </div>
            ) : (
              <>
                <div id="reader" className="w-full h-full object-cover"></div>
                {isScanning && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    {/* Glowing scanner frame */}
                    <div className="w-[70%] h-[70%] border-2 border-orange-500 rounded-3xl relative shadow-[0_0_20px_rgba(249,115,22,0.3)] animate-pulse">
                      {/* Scanning laser effect */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_0_10px_rgba(249,115,22,0.8)] animate-scanner-laser"></div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Camera selection dropdown if multiple cameras available */}
          {hasPermission && cameras.length > 1 && (
            <div className="w-full mt-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
              <RefreshCw size={14} className="text-gray-400 animate-spin-slow" />
              <select 
                value={activeCameraId} 
                onChange={handleCameraChange}
                className="bg-transparent text-xs text-gray-300 font-bold border-none outline-none w-full cursor-pointer"
              >
                {cameras.map(camera => (
                  <option key={camera.id} value={camera.id} className="bg-[#111] text-white">
                    {camera.label || `Camera ${cameras.indexOf(camera) + 1}`}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default QrScannerModal;
