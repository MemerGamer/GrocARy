/* eslint-disable no-undef */


// Mock react-native-vision-camera
jest.mock('react-native-vision-camera', () => ({
    Camera: () => <></>,
    useCameraDevice: jest.fn(() => ({})),
    useCameraPermission: jest.fn(() => ({
        hasPermission: true,
        requestPermission: jest.fn().mockResolvedValue(true),
    })),
    useCodeScanner: jest.fn(),
    useFrameProcessor: jest.fn(),
}));

// Mock @reactvision/react-viro
jest.mock('@reactvision/react-viro', () => ({
    ViroARSceneNavigator: () => <></>,
    ViroARScene: ({ children }) => <>{children}</>,
    ViroText: ({ text }) => <>{text}</>,
    ViroBox: () => <></>,
    ViroMaterials: {
        createMaterials: jest.fn(),
    },
    ViroAnimations: {
        registerAnimations: jest.fn(),
    },
    ViroNode: ({ children }) => <>{children}</>,
    ViroFlexView: ({ children }) => <>{children}</>,
}));

// Mock react-native-worklets-core if needed
jest.mock('react-native-worklets-core', () => ({
    useSharedValue: jest.fn(),
    useWorkletCallback: jest.fn(),
}));

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
