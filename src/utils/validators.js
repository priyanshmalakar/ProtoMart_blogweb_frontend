export const validateEmail = (email) => {
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return regex.test(email);
};

export const validatePhone = (phone) => {
  const regex = /^[0-9]{10}$/;
  return regex.test(phone);
};

export const validatePinCode = (pinCode) => {
  const regex = /^[0-9]{6}$/;
  return regex.test(pinCode);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic'];
  const maxSize = 50 * 1024 * 1024; // 50MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPEG, PNG, and HEIC images are allowed.'
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size must be less than 50MB.'
    };
  }

  return { valid: true };
};

export const validateBlogContent = (content) => {
  const minLength = 50;
  const cleanContent = content.replace(/<[^>]*>/g, '').trim();
  
  if (cleanContent.length < minLength) {
    return {
      valid: false,
      error: `Content must be at least ${minLength} characters.`
    };
  }

  return { valid: true };
};

export const validateAmount = (amount, min = 0, max = Infinity) => {
  const numAmount = parseFloat(amount);

  if (isNaN(numAmount)) {
    return { valid: false, error: 'Please enter a valid amount' };
  }

  if (numAmount < min) {
    return { valid: false, error: `Amount must be at least ₹${min}` };
  }

  if (numAmount > max) {
    return { valid: false, error: `Amount cannot exceed ₹${max}` };
  }

  return { valid: true };
};

export const sanitizeInput = (input) => {
  return input
    .replace(/[<>]/g, '')
    .trim();
};

export const validateGooglePhotosLink = (link) => {
  const patterns = [
    /photos\.app\.goo\.gl\/[a-zA-Z0-9]+/,
    /photos\.google\.com\/share\/[a-zA-Z0-9]+/,
    /photos\.google\.com\/album\/[a-zA-Z0-9]+/
  ];

  for (const pattern of patterns) {
    if (pattern.test(link)) {
      return { valid: true };
    }
  }

  return {
    valid: false,
    error: 'Invalid Google Photos link. Please use a valid album share link.'
  };
};