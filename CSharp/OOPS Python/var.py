class Car:
    wheels=4 #class and static var
    
    def __init__(self):
        self.mil=10
        self.com="BMW" #instance var
        

car1=Car()
car2=Car()

car1.mil=8
Car.wheels=3   #change class var value using Class name

print(car1.mil, car1.com, car1.wheels)
print(car2.mil, car2.com, car2.wheels)