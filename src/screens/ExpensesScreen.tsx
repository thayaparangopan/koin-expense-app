import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../constants/theme';
import { UploadCard } from '../components/UploadCard';
import { ExpenseItem } from '../components/ExpenseItem';
import { BottomNavigation, TabKey } from '../components/BottomNavigation';
import { ExpenseRecord, ExtractionResult } from '../types/expense';
import { extractReceiptData } from '../services/receiptExtraction';

interface ExpensesScreenProps {
  expenses: ExpenseRecord[];
  onStartReview: (extracted: ExtractionResult) => void;
}

export const ExpensesScreen: React.FC<ExpensesScreenProps> = ({
  expenses,
  onStartReview,
}) => {
  const [isScanning, setIsScanning] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<TabKey>('Expenses');

  const processImageUri = async (uri?: string, base64?: string) => {
    try {
      setIsScanning(true);
      const extracted = await extractReceiptData(uri, base64);
      setIsScanning(false);
      onStartReview(extracted);
    } catch (error) {
      setIsScanning(false);
      Alert.alert('Scan Error', 'Unable to extract receipt details. Please try again.');
    }
  };

  const handleCamera = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Camera Permission Required',
            'Camera access is needed to capture receipts directly. You can pick an existing receipt from your gallery instead.',
            [
              { text: 'Open Gallery', onPress: handleGallery },
              { text: 'Sample Receipt', onPress: () => processImageUri() },
            ]
          );
          return;
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: Platform.OS !== 'web',
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        await processImageUri(
          result.assets[0].uri,
          result.assets[0].base64 || undefined
        );
      }
    } catch (err) {
      console.warn('Camera launch fallback:', err);
      // On web or desktop where camera is not available, open file gallery
      handleGallery();
    }
  };

  const handleGallery = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Photo Permission Required',
            'Gallery access is needed to upload receipts. Continuing with sample preview.',
            [{ text: 'Continue', onPress: () => processImageUri() }]
          );
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: Platform.OS !== 'web',
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        await processImageUri(
          result.assets[0].uri,
          result.assets[0].base64 || undefined
        );
      }
    } catch (err) {
      console.warn('Gallery launch fallback:', err);
      await processImageUri();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.brandTitle}>KOIN</Text>
              <Text style={styles.screenTitle}>Expenses</Text>
            </View>

            <TouchableOpacity
              style={styles.scanBillButton}
              onPress={handleCamera}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={18} color={theme.colors.textWhite} />
              <Text style={styles.scanBillText}>Scan Bill</Text>
            </TouchableOpacity>
          </View>

          {/* Upload / Snap Card */}
          <UploadCard
            onPressCamera={handleCamera}
            onPressGallery={handleGallery}
            isScanning={isScanning}
          />

          {/* Recent Activity Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            {expenses.length > 0 && (
              <Text style={styles.sectionSubtitle}>This week</Text>
            )}
          </View>

          <View style={styles.activityList}>
            {expenses.length === 0 ? (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconCircle}>
                  <Ionicons name="receipt-outline" size={26} color={theme.colors.textPlaceholder} />
                </View>
                <Text style={styles.emptyTitle}>No expenses yet</Text>
                <Text style={styles.emptySubtitle}>
                  Snap or upload a bill above to record your first expense
                </Text>
              </View>
            ) : (
              expenses.map((expense, index) => (
                <ExpenseItem
                  key={expense.id}
                  expense={expense}
                  isLast={index === expenses.length - 1}
                />
              ))
            )}
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <BottomNavigation
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
    marginTop: 4,
  },
  brandTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  scanBillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    gap: 4,
  },
  scanBillText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textWhite,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  activityList: {
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#F1ECE5',
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    maxWidth: 240,
    lineHeight: 18,
  },
});
