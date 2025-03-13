using System;

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
            "Which planet is known as the 'Red Planet'?"
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
            "Mars"
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
            { "Mars", "Venus", "Jupiter", "Saturn" }
               };

        for(int i=0;i <=questions.Length-1;i++)
        {
            Console.WriteLine();
            Console.WriteLine(questions[i]);

            for(int j = 0; j <= 3; j++)
            {
                Console.WriteLine(options[i, j]); 
            }

            Console.WriteLine("Enter your answer: ");


            string ans = Console.ReadLine().ToLower();

            if(ans == answers[i].ToLower())
            {
                Console.WriteLine("Correct!");
                score++;
            }
            else
            {
                Console.WriteLine("Incorrect!");
            }

        }

        int per=(score/questions.Length) * 100;

        Console.WriteLine("");
        Console.WriteLine("Your Score is: " + "score");

        if (per >= 70)
        {
            Console.WriteLine("Congratulations! You have passed the quiz.");
        }
        else
        {
            Console.WriteLine("You have failed the quiz.");
        }

    }
}