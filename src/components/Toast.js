import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../AppContext';

export default function Toast() {
  const { registerToast, theme } = useApp();
  const insets = useSafeAreaInsets();
  const [msg, setMsg] = useState('');
  const [type, setType] = useState('success');
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    registerToast((message, toastType) => {
      setMsg(message);
      setType(toastType);
      Animated.sequence([
        Animated.spring(anim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
        Animated.delay(2200),
        Animated.timing(anim, { toValue: 0, duration: 280, useNativeDriver: true }),
      ]).start();
    });
  }, []);

  const isSuccess = type === 'success';
  const iconColor = isSuccess ? '#10b981' : '#f43f5e';
  const bgColor = isSuccess
    ? (theme.isDark ? '#052e16' : '#f0fdf4')
    : (theme.isDark ? '#1f0a0a' : '#fff1f2');
  const borderColor = isSuccess
    ? (theme.isDark ? '#065f46' : '#bbf7d0')
    : (theme.isDark ? '#7f1d1d' : '#fecdd3');
  const textColor = isSuccess
    ? (theme.isDark ? '#34d399' : '#065f46')
    : (theme.isDark ? '#fb7185' : '#9f1239');

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-100, 0] });
  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] });

  return (
    <Animated.View
      style={[
        styles.toast,
        { top: insets.top + 12, backgroundColor: bgColor, borderColor },
        { opacity: anim, transform: [{ translateY }, { scale }] },
      ]}
      pointerEvents="none"
    >
      <View style={[styles.iconWrap, { backgroundColor: iconColor + '20' }]}>
        <Ionicons
          name={isSuccess ? 'checkmark-circle' : 'alert-circle'}
          size={20}
          color={iconColor}
        />
      </View>
      <Text style={[styles.text, { color: textColor }]}>{msg}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 16, right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  iconWrap: {
    width: 32, height: 32, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  text: { fontSize: 13, fontWeight: '700', flex: 1 },
});
