using System;

public class HelloWorld
{
    public static void Main(string[] args)
    {
        int score = 0;

        Console.WriteLine("Hello User!");
        Console.WriteLine("Welcome to the Quiz!");

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
            "3.14159",
            "Australia",
            "Central Processing Unit",
            "1945",
            "Forwards data packets between computer networks",
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

        }

    }
}