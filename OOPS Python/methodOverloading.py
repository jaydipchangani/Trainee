class Cal:
    def add(self,*args):
        res=0
        for i in args:
            res +=i
        return res
    
    def minus(self,*args):
        res=0
        for i in args:
            args=args-i
        return res

example1=Cal()

print(example1.add(1,5,6,4))