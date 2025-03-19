using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace CSharpTaskThree
{
    class AesFunction
    {
        private static readonly string Key = "1234567890123456"; // 16-byte key (128-bit)
        private static readonly string IV = "6543210987654321";  // 16-byte IV

        // Encrypt a string using AES
        public static string Encrypt(string plainText)
        {
            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(Key);
                aes.IV = Encoding.UTF8.GetBytes(IV);

                using (MemoryStream memoryStream = new MemoryStream())
                {
                    using (CryptoStream cryptoStream = new CryptoStream(memoryStream, aes.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        using (StreamWriter writer = new StreamWriter(cryptoStream))
                        {
                            writer.Write(plainText);
                        }
                    }
                    return Convert.ToBase64String(memoryStream.ToArray()); // Convert encrypted data to Base64
                }
            }
        }

        // Decrypt a string using AES
        public static string Decrypt(string encryptedText)
        {
            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(Key);
                aes.IV = Encoding.UTF8.GetBytes(IV);

                using (MemoryStream memoryStream = new MemoryStream(Convert.FromBase64String(encryptedText)))
                {
                    using (CryptoStream cryptoStream = new CryptoStream(memoryStream, aes.CreateDecryptor(), CryptoStreamMode.Read))
                    {
                        using (StreamReader reader = new StreamReader(cryptoStream))
                        {
                            return reader.ReadToEnd(); // Read and return decrypted text
                        }
                    }
                }
            }
        }
    }
}
