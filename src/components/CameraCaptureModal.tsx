import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

interface CameraCaptureModalProps {
  visible: boolean;
  onCapture: (base64Data: string, uri: string) => void;
  onClose: () => void;
  onFallbackToFile: () => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  visible,
  onCapture,
  onClose,
  onFallbackToFile,
}) => {
  const videoRef = useRef<any>(null);
  const streamRef = useRef<any>(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!visible || Platform.OS !== 'web') return;

    let isMounted = true;

    async function initCamera() {
      try {
        if (
          typeof navigator === 'undefined' ||
          !navigator.mediaDevices ||
          !navigator.mediaDevices.getUserMedia
        ) {
          setHasCamera(false);
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 } },
          audio: false,
        });

        if (!isMounted) {
          stream.getTracks().forEach((track: any) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err: any) {
        console.warn('Webcam access error:', err);
        setErrorMsg('Camera access was not granted or is unavailable.');
        setHasCamera(false);
      }
    }

    initCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track: any) => track.stop());
        streamRef.current = null;
      }
    };
  }, [visible]);

  const handleSnap = () => {
    if (Platform.OS !== 'web' || !videoRef.current) return;

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      const base64 = dataUrl.split(',')[1] || '';

      // Stop stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track: any) => track.stop());
        streamRef.current = null;
      }

      onCapture(base64, dataUrl);
    } catch (err) {
      console.warn('Snap error:', err);
    }
  };

  if (!visible || Platform.OS !== 'web') return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Capture Receipt</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close-circle" size={26} color={theme.colors.textWhite} />
            </TouchableOpacity>
          </View>

          {/* Camera Viewfinder */}
          <View style={styles.viewfinder}>
            {hasCamera ? (
              // @ts-ignore - native DOM video element for Web
              <video
                ref={videoRef}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 16,
                  backgroundColor: '#000',
                }}
                autoPlay
                playsInline
                muted
              />
            ) : (
              <View style={styles.noCameraView}>
                <Ionicons name="camera-reverse-outline" size={48} color="#94A3B8" />
                <Text style={styles.noCameraText}>
                  {errorMsg || 'Camera is not available on this device.'}
                </Text>
                <TouchableOpacity
                  style={styles.fallbackButton}
                  onPress={() => {
                    onClose();
                    onFallbackToFile();
                  }}
                >
                  <Ionicons name="images-outline" size={18} color="#FFF" style={{ marginRight: 6 }} />
                  <Text style={styles.fallbackButtonText}>Upload Receipt File</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Receipt alignment guide overlay */}
            {hasCamera && (
              <View style={styles.guideFrame} pointerEvents="none">
                <Text style={styles.guideText}>Align receipt within frame</Text>
              </View>
            )}
          </View>

          {/* Action Bar */}
          {hasCamera && (
            <View style={styles.actionBar}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.snapButtonOuter}
                onPress={handleSnap}
                activeOpacity={0.8}
              >
                <View style={styles.snapButtonInner} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.uploadAlternative}
                onPress={() => {
                  onClose();
                  onFallbackToFile();
                }}
              >
                <Ionicons name="images-outline" size={22} color={theme.colors.textWhite} />
                <Text style={styles.altText}>Upload</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(11, 19, 43, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    maxWidth: 480,
    height: '85%',
    maxHeight: 640,
    backgroundColor: '#0F172A',
    borderRadius: 24,
    overflow: 'hidden',
    padding: 16,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textWhite,
  },
  viewfinder: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCameraView: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noCameraText: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
    lineHeight: 20,
  },
  fallbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  fallbackButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  guideFrame: {
    position: 'absolute',
    top: 24,
    bottom: 24,
    left: 24,
    right: 24,
    borderWidth: 2,
    borderColor: 'rgba(0, 176, 116, 0.6)',
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 12,
  },
  guideText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 16,
  },
  cancelButton: {
    padding: 10,
    width: 60,
  },
  cancelText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
  snapButtonOuter: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 4,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  snapButtonInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.textWhite,
  },
  uploadAlternative: {
    alignItems: 'center',
    width: 60,
  },
  altText: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
});
