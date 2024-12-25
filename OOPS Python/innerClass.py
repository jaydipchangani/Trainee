class Student:
    
    def __init__(self,name,rn):
        self.name=name
        self.rn=rn
        self.mrk=self.Marks()
    
    def show(self):
        print(self.name, self.rn)
        
    class Marks:        #inner class
        
        def __init__(self):
            self.a=67
            self.b=45
    

s1=Student("JD",1)
s2=Student("Hui",2)

print(s1.mrk.a)

s1.show()