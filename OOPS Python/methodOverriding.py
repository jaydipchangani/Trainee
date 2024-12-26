class Human:
    def walk(self):
        print("All human can walk")
        
class Men(Human):
    def walk(self):
        print("Men can walk")
        
class Women(Human):
    def walk(self):
        print("Women can walk")
        

human1=Human()
human1.walk()

men1=Men()
men1.walk()


women1=Women()
women1.walk()