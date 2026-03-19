import { firebaseAuth } from '../config/firebase';

export const authService = {
  // Email Login
  loginWithEmail: async (email: any, password: any) => {
    try {
      const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Email Login Error:', error);
      throw error;
    }
  },

  // Email Signup
  signupWithEmail: async (email: any, password: any) => {
    try {
      const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Email Signup Error:', error);
      throw error;
    }
  },

  // Phone Login - Step 1: Send OTP
  sendOtp: async (phoneNumber: any) => {
    try {
      const confirmation = await firebaseAuth.signInWithPhoneNumber(phoneNumber);
      return confirmation;
    } catch (error) {
      console.error('Send OTP Error:', error);
      throw error;
    }
  },

  // Phone Login - Step 2: Verify OTP
  confirmOtp: async (confirmation: any, code: any) => {
    try {
      const result = await confirmation.confirm(code);
      return result.user;
    } catch (error) {
      console.error('Confirm OTP Error:', error);
      throw error;
    }
  },

  // Sign out
  logout: async () => {
    try {
      await firebaseAuth.signOut();
    } catch (error) {
      console.error('Logout Error:', error);
      throw error;
    }
  },

  // Email Verification
  sendEmailVerification: async () => {
    try {
      const user = firebaseAuth.currentUser;
      if (user) {
        await user.sendEmailVerification();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Email Verification Error:', error);
      throw error;
    }
  },

  // Check if email is verified
  isEmailVerified: () => {
    const user = firebaseAuth.currentUser;
    if (user) {
      user.reload(); // Refresh the user state from Firebase
      return user.emailVerified;
    }
    return false;
  },

  // Get current user
  getCurrentUser: () => {
    return firebaseAuth.currentUser;
  },
};
