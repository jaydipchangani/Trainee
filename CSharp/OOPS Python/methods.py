class Student:
    
    sch="ABC"
    
    def __init__(self,m1,m2,m3):
        self.m1=m1
        self.m2=m2
        self.m3=m3
    
    def avg(self):    #instance method
        return((self.m1+self.m2+self.m3)/3) 
        
    @classmethod   
    def info(cls):    #class method
        return (cls.sch)
    
    @staticmethod
    def basic():    #static method
        print("It is ABC college")

s1=Student(30,52,19)
s2=Student(20,95,48)

print(Student.info())
#print(s1.info())

s1.basic()

print(s2.avg())