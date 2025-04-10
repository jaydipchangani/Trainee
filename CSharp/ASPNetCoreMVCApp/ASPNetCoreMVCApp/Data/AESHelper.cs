﻿using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace ASPNetCoreMVCApp { 
public class AESHelper
{
    private static readonly string EncryptionKey = "75b4aa733b92dbde4a03d0a3065e5650";
    private static readonly byte[] IV = Encoding.UTF8.GetBytes("1234567890123456");

    public static string Encrypt(string text)
    {
            if (string.IsNullOrEmpty(text))
                throw new ArgumentNullException(nameof(text), "Input text cannot be null or empty.");

            byte[] keyBytes = Convert.FromBase64String("75b4aa733b92dbde4a03d0a3065e5650");

            using (Aes aes = Aes.Create())
            {
                aes.Key = keyBytes;
                aes.GenerateIV(); // Generates a secure 16-byte IV
                byte[] iv = aes.IV;

                ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, iv);
                byte[] encrypted = encryptor.TransformFinalBlock(Encoding.UTF8.GetBytes(text), 0, text.Length);

                // Store IV with encrypted data
                byte[] combined = new byte[iv.Length + encrypted.Length];
                Buffer.BlockCopy(iv, 0, combined, 0, iv.Length);
                Buffer.BlockCopy(encrypted, 0, combined, iv.Length, encrypted.Length);

                return Convert.ToBase64String(combined);
            }
        }

        public static string Decrypt(string encryptedText)
        {
            if (string.IsNullOrEmpty(encryptedText))
                throw new ArgumentNullException(nameof(encryptedText), "Input text cannot be null or empty.");

            byte[] keyBytes = Convert.FromBase64String("75b4aa733b92dbde4a03d0a3065e5650");
            byte[] combinedBytes = Convert.FromBase64String(encryptedText);

            using (Aes aes = Aes.Create())
            {
                aes.Key = keyBytes;

                // Extract IV from the first 16 bytes
                byte[] iv = new byte[16];
                byte[] cipherBytes = new byte[combinedBytes.Length - 16];

                Buffer.BlockCopy(combinedBytes, 0, iv, 0, 16);
                Buffer.BlockCopy(combinedBytes, 16, cipherBytes, 0, cipherBytes.Length);

                aes.IV = iv;

                ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
                byte[] decrypted = decryptor.TransformFinalBlock(cipherBytes, 0, cipherBytes.Length);

                return Encoding.UTF8.GetString(decrypted);
            }
        }

    }
}
