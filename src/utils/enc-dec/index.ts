import AES from 'aes-js';

const encryptPayload = (payload: any, secretKey: string): string => {
    const key = AES.utils.utf8.toBytes(secretKey)
    const keyBytes = key.slice(0, 16)
    const iv = AES.utils.utf8.toBytes('1234567890123456')
    const cipher = new AES.ModeOfOperation.cbc(keyBytes, iv)
    const textBytes = AES.utils.utf8.toBytes(JSON.stringify(payload))
    const paddedTextBytes = AES.padding.pkcs7.pad(textBytes)
    const encryptedBytes = cipher.encrypt(paddedTextBytes)
    return AES.utils.hex.fromBytes(encryptedBytes)
};

const decryptPayload = (encryptedHex: string, secretKey: string): any => {
    const encryptedBytes = AES.utils.hex.toBytes(encryptedHex);
    const key = AES.utils.utf8.toBytes(secretKey);
    const keyBytes = key.slice(0, 16); // Ensure the key length matches the encryption key length
    const iv = AES.utils.utf8.toBytes('1234567890123456'); // Same IV as used during encryption
    const cipher = new AES.ModeOfOperation.cbc(keyBytes, iv);
    const decryptedBytes = cipher.decrypt(encryptedBytes);
    const unpaddedBytes = AES.padding.pkcs7.strip(decryptedBytes);
    const decryptedText = AES.utils.utf8.fromBytes(unpaddedBytes);
    return JSON.parse(decryptedText);
};


export default { encryptPayload, decryptPayload }
