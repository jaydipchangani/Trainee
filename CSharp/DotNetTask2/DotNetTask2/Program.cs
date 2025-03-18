
//// 1st
File.WriteAllText("test.txt", "Hello Welcome to task 2");
Console.WriteLine("File  created a file and add some text");


////2nd

File.WriteAllText("test.txt", "Hello Welcome to task 2 subtask 2-2");
Console.WriteLine("\nFile  created a file and add some text");
string fileData = File.ReadAllText("test.txt");
Console.WriteLine(fileData);

//3rd

string[] arr = { "a", "b", "c", "d", "e", "f" };
File.WriteAllLines("test.txt", arr);
string arrayFile = File.ReadAllText("test.txt");
Console.WriteLine(arrayFile);

//4th

File.AppendAllText("test.txt", "Hello How are you ?");
Console.WriteLine(File.ReadAllText("test.txt"));