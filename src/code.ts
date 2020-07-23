import { Observable } from "rxjs/Observable";

const observable = Observable.create((observer:any) => {
  
  setInterval(() => {
    observer.next([[1,2],[3,4]])
  }, 2500);

})

observable.subscribe((board:Array<Array<Number>>) => {
  console.log(board)
})