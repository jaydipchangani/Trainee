class human:
    def __init__(self,spe):
        self.spe=spe
    
    def walk(self):
        print("Human can walk")
    
class men(human):
    def walk(self):
        print("Men can speak")

class women(human):
    def walk(self):
        print("Women can speak")
        

human1=human("homo")
man1=men("Men")
woman1=women("Women")

human1.walk()
man1.walk()
woman1.walk()