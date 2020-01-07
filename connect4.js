class Connect4{
    constructor(selector){
        this.ROWS = 6;
        this.COLS = 7;
        this.player = 'red';
        this.selector=selector;
        this.isGameOver = false;
        this.onPlayerMove = function() {};
        this.createGrid();
        this.setupEventListeners();

     //in this connect4 class we create grid when the constructor is called
    }
//inside the constructor we loop over every row and creat a div called row and inside of every row we create 7 diff coloumns
    createGrid(){
        const $board = $(this.selector);
        $board.empty();
        this.isGameOver = false;
        this.player = 'red';
        for (let row = 0; row < this.ROWS; row++){
            const $row = $('<div>') 
              .addClass('row');
            $board.append($row);
            for (let col = 0; col < this.COLS; col++){
                const $col = $('<div>')
                .addClass('col empty')
                .attr('data-col', col)
                .attr('data-row', row);
                $row.append($col);
            }
                $board.append($row);
         } 
        }

    setupEventListeners(){
        const $board = $(this.selector);
        const that = this;

        function findLastEmptyCell(col){
            const cells = $(`.col[data-col='${col}']`);
            for (let i = cells.length - 1;i >= 0; i--) {
                const $cell = $(cells[i]);
                if ($cell.hasClass('empty')){
                    return $cell;
                }
            }
            return null;
         }

         $board.on('mouseenter', '.col.empty', function() {
             if (that.isGameOver) return;
            const col = $(this).data('col');
            const $lastEmptyCell = findLastEmptyCell(col);
            $lastEmptyCell.addClass(`next-${that.player}`);
         });

         $board.on('mouseleave', '.col', function() {
            $('.col').removeClass(`next-${that.player}`);
         });

         $board.on ('click', '.col.empty', function(){
           if (that.isGameOver) return;
            const col = $(this).data('col');
            const row = $(this).data('row');
            const $lastEmptyCell = findLastEmptyCell(col);
            $lastEmptyCell.removeClass(`empty next-${that.player}`);
            $lastEmptyCell.addClass(that.player);
            $lastEmptyCell.data('player', that.player);


            const winner = that.checkForWinner(
                $lastEmptyCell.data('row'), 
                $lastEmptyCell.data('col')
            )
            if (winner){
                that.isGameOver = true;
                alert(`Game Over! Player ${that.player} has won!`);
                $('.col.empty').removeClass('empty');
                return;
            }
            
            that.player = (that.player === 'red') ? 'black' : 'red';
            that.onPlayerMove();
            $(this).trigger('mouseenter');
        });
    }

    checkForWinner(row,col) {
        const that = this;

        function $getCell(i, j){
            return $(`.col[data-row='${i}'][data-col='${j}']`);
        }

        function checkDirection(direction) {
            let total = 0;
            let i = row + direction.i;
            let j = col + direction.j;
            let $next = $getCell(i, j);
            while (i >=0 &&
                i < that.ROWS &&
                j >= 0 &&
                j < that.COLS &&
                $next.data('player') === that.player) {
                total++;
                i += direction.i;
                j += direction.j;  
                $next = $getCell(i, j);
            }
            return total;
         }

        function checkWin(direactionA, directionB) {
            const total = 1 +
                checkDirection(direactionA) +
                checkDirection(directionB);
            if (total >=4){
                return that.player;
              } else {
                return null;
            }
        }

        function checkDiagonalBLtoTr() {
            return checkWin({i: 1, j: -1}, {i: 1, j: 1});
        }

        function checkDiagonalTLtoBR() {
            return checkWin({i: 1, j: 1}, {i: -1, j: -1});
        }
        
        function checkVerticals() {
            return checkWin({i: -1, j: 0}, {i:1, j:0});
        }

        function checkHorizontals() {
            return checkWin({i: 0, j: -1}, {i:0, j:1});
        }

        return checkVerticals() ||
         checkHorizontals () || 
         checkDiagonalBLtoTr() ||
         checkDiagonalTLtoBR();
    }

    restart () {
        this.createGrid();
        this.onPlayerMove();
    }
}

/* when is the grid is created, we creat grids and set up event listeners and than 
everytime we click on the cell or coloumn we will do differente things; for example
if its player red turn we will place red token and if its player black turn 
we will place black token, and we hover over different coloumns we just change hover
state. everytime we click we check that someone has won or to see last player won
and if they win we just display alert game over and then we switch player from 
black to red and we trigger mouseenter because that fixes the bug with hover state*/