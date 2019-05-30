import * as rx from 'rxjs';

rx.fromEvent<MouseEvent>(document,'mouseDown')
    .subscribe(x => console.log(x));