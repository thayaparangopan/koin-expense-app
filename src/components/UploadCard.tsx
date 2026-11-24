import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

interface UploadCardProps {
  onPressCamera: () => void;
  onPressGallery: () => void;
  isScanning?: boolean;
}

export const UploadCard: React.FC<UploadCardProps> = ({
  onPressCamera,
  onPressGallery,
  isScanning = false,
}) => {
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={onPressGallery}
      activeOpacity={0.9}
      disabled={isScanning}
    >
      {isScanning ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingTitle}>Scanning Receipt...</Text>
          <Text style={styles.loadingSubtitle}>Extracting store details, items & prices</Text>
        </View>
      ) : (
        <>
          <View style={styles.iconCircle}>
            <Ionicons name="receipt-outline" size={26} color={theme.colors.primary} />
          </View>

          <Text style={styles.title}>Upload or Snap a Bill</Text>
          <Text style={styles.subtitle}>Less typing. More living.</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation?.();
                onPressCamera();
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="camera-outline"
                size={20}
                color={theme.colors.textPrimary}
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation?.();
                onPressGallery();
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="images-outline"
                size={20}
                color={theme.colors.textPrimary}
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: theme.colors.dashedBorder,
    borderStyle: 'dashed',
    paddingVertical: 26,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginVertical: 12,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 14,
    width: '100%',
    justifyContent: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.cardWarm,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 14,
    flex: 1,
    maxWidth: 140,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  loadingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: 14,
  },
  loadingSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
});
