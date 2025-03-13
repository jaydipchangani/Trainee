using System;
using System.Reflection.Metadata.Ecma335;
using System.Security.Cryptography.X509Certificates;

public class HelloWorld
{
    public static void Main(string[] args)
    {
        int score = 0;

        Console.WriteLine("Hello User!");
        Console.WriteLine("Enter your Subh name:");

        string name = Console.ReadLine();
        Console.WriteLine();

        Console.WriteLine($"Welcome to the Quiz, {name}!");

        Console.WriteLine("Only options A,B,C and D are accepted \nBest of Luck !! ");


        string[] questions = {
            "What is the chemical symbol for gold?",
            "What is the value of pi (π) approximately?",
            "Which continent is known as the 'Land Down Under'?",
            "What does CPU stand for?",
            "In which year did World War II end?",
            "What is the primary function of a router in a network?",
            "What is the largest ocean in the world?",
            "Who wrote 'Romeo and Juliet'?",
            "What is the powerhouse of the cell?",
            "Which planet is known as the 'Red Planet'?",
            "What is the capital of France?"
            };

        string[] answers = {
            "Au",
            "3.14",
            "Australia",
            "Central Processing Unit",
            "1945",
            "Directing network traffic",
            "Pacific Ocean",
            "William Shakespeare",
            "Mitochondria",
            "Mars",
            "Paris"
            };

        string[,] options = {
            { "Au", "Ag", "Fe", "Cu" },
            { "3.14", "2.71", "1.61", "4.20" },
            { "Australia", "Africa", "South America", "Europe" },
            { "Central Processing Unit", "Computer Peripheral Unit", "Control Program Utility", "Circuit Processing Unit" },
            { "1945", "1939", "1950", "1941" },
            { "Directing network traffic", "Storing data", "Displaying web pages", "Printing documents" },
            { "Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean" },
            { "William Shakespeare", "Charles Dickens", "Jane Austen", "Mark Twain" },
            { "Mitochondria", "Nucleus", "Endoplasmic reticulum", "Golgi apparatus" },
            { "Mars", "Venus", "Jupiter", "Saturn" },
            { "Paris", "London", "Rome", "Berlin" }
               };

        Console.WriteLine(questions.Length);


        for (int i = 0; i <= questions.Length - 1; i++)
        {
            Console.WriteLine();
            Console.WriteLine(questions[i]);

            Console.WriteLine();

        Again:
            Console.WriteLine($"A : {options[i, 0]}");
            Console.WriteLine($"B : {options[i, 1]}");
            Console.WriteLine($"C : {options[i, 2]}");
            Console.WriteLine($"D : {options[i, 3]}");

            Console.WriteLine("Enter your answer: ");

            string ans = Console.ReadLine().ToLower();
            string realAnswer = "";


            for (int j = 0; j <= answers.Length - 1; j++)
            {
                if (ans == "a")
                {
                    realAnswer = options[i, 0];
                }
                else if (ans == "b")
                {
                    realAnswer = options[i, 1];
                }
                else if (ans == "c")
                {
                    realAnswer = options[i, 2];
                }
                else if (ans == "d")
                {
                    realAnswer = options[i, 3];
                }
                else
                {
                    Console.WriteLine("Invalid Option\nAg" +
                        "aain enter your Answer");
                    goto Again;

                }
            }

            if (realAnswer == answers[i])
            {
                Console.WriteLine("Correct Answer!");
                score++;
            }
            else
            {
                Console.WriteLine("Wrong Answer!");
            }

        }
            int per = (score / questions.Length) * 100;

            Console.WriteLine("");
            Console.WriteLine("Your Score is: " + per);

            if (per >= 70)
            {
                Console.WriteLine("Congratulations! " +name+ " You have passed the quiz.");
            }
            else
            {
                Console.WriteLine("Awwwwww Sorry "+name+" You have failed the quiz.");
            }

        }
    
}