class car:
    def __init__(self,tire,door,roof):
        self.tire=tire
        self.door=door
        self.roof=roof
        print("Car key is entered !!")
        
    def start(self):
        print("Car started")
    
    def stop(self):
        print("Car stopped")
        
    def things(self):
        print("Car have",self.tire,"tire and",self.door,"door")

maruti=car(4,4,1)

maruti.things()
maruti.start()
maruti.stop()



        