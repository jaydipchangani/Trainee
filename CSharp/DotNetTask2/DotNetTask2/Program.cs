
Console.WriteLine("Task 1");
File.WriteAllText("test.txt", "Hello Welcome to task 2");
Console.WriteLine("File  created a file and add some text");

Console.WriteLine("\nTask 2");
File.WriteAllText("test.txt", "Hello Welcome to task 2 subtask 2-2");
string fileData = File.ReadAllText("test.txt");
Console.WriteLine(fileData);

Console.WriteLine("\nTask 3");
string[] arr = { "a", "b", "c", "d", "e", "f" };
File.WriteAllLines("test.txt", arr);
string arrayFile = File.ReadAllText("test.txt");
Console.WriteLine(arrayFile);

Console.WriteLine("\nTask 4");
File.AppendAllText("test.txt", "Hello How are you ?");
Console.WriteLine(File.ReadAllText("test.txt"));

Console.WriteLine("\nTask 5");
Console.WriteLine(File.ReadAllLines("test.txt").First());

Console.WriteLine("\nTask 6");
var len=File.ReadAllLines("test.txt").Length;
Console.WriteLine(len);