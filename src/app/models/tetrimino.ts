export enum TetriminoType {
    I = 'I',
    J = 'J',
    L = 'L',
    O = 'O',
    S = 'S',
    T = 'T',
    Z = 'Z'
}

export class BoardLocation {
    public row: number;
    public col: number;

    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
    }
}

export enum TetriminoMove {
    down = 'down',
    left = 'left',
    right = 'right',
    rotateLeft = 'rotateLeft',
    rotateRight = 'rotateRight',
}

export class Tetrimino {

    public type: TetriminoType;
    public location: BoardLocation;

    private _cells: BoardLocation[];

    private init(): void {
        this._cells = [];
        // Add the "main" cell
        this._cells.push(this.location);

        // Based on Tetrimino type, determine the other cells in relation to the main cell
        switch (this.type) {
            case TetriminoType.O:
                // [row, col+1], [row+1, col], [row+1, col+1]
                this._cells.push(new BoardLocation(this.location.row, this.location.col - 1));
                this._cells.push(new BoardLocation(this.location.row - 1, this.location.col));
                this._cells.push(new BoardLocation(this.location.row - 1, this.location.col - 1));
                break;
            case TetriminoType.I:
                // [row, col-2], [row, col-1], [row, col+1]
                this._cells.push(new BoardLocation(this.location.row, this.location.col - 2));
                this._cells.push(new BoardLocation(this.location.row, this.location.col - 1));
                this._cells.push(new BoardLocation(this.location.row, this.location.col + 1));
                break;
            case TetriminoType.J:
                // [row+1, col], [row-1, col], [row-1, col-1]
                this._cells.push(new BoardLocation(this.location.row - 1, this.location.col));
                this._cells.push(new BoardLocation(this.location.row + 1, this.location.col));
                this._cells.push(new BoardLocation(this.location.row + 1, this.location.col + 1));
                break;
            case TetriminoType.T:
                // [row, col-1], [row, col+1], [row+1, col]
                this._cells.push(new BoardLocation(this.location.row, this.location.col + 1));
                this._cells.push(new BoardLocation(this.location.row, this.location.col - 1));
                this._cells.push(new BoardLocation(this.location.row - 1, this.location.col));
                break;
            case TetriminoType.L:
                // [row+1, col], [row-1, col], [row-1, col+1]
                this._cells.push(new BoardLocation(this.location.row - 1, this.location.col));
                this._cells.push(new BoardLocation(this.location.row + 1, this.location.col));
                this._cells.push(new BoardLocation(this.location.row + 1, this.location.col - 1));
                break;
            case TetriminoType.S:
                // [row, col-1], [row+1, col], [row+1, col+1]
                this._cells.push(new BoardLocation(this.location.row, this.location.col - 1));
                this._cells.push(new BoardLocation(this.location.row - 1, this.location.col));
                this._cells.push(new BoardLocation(this.location.row - 1, this.location.col + 1));
                break;
            case TetriminoType.Z:
                // [row, col+1], [row+1, col], [row+1, col-1]
                this._cells.push(new BoardLocation(this.location.row, this.location.col - 1));
                this._cells.push(new BoardLocation(this.location.row + 1, this.location.col));
                this._cells.push(new BoardLocation(this.location.row + 1, this.location.col + 1));
                break;
            default:
                console.error('Invalid Tetrimino Type');
                return;
        }
    }

    constructor(type: TetriminoType, spawnLocation: BoardLocation) {
        this.type = type;
        this.location = spawnLocation;
        this.init();
    }

    public get cells(): BoardLocation[] { return this._cells; }

    // Get the height of the Tetrimino (number of cells from bottom-most to top-most)
    public get height(): number {
        const sorted = this.cells.sort((a, b) => a.row - b.row);
        return sorted[sorted.length - 1].row - sorted[0].row + 1;
    };

    // Get the width of the Tetrimino (number of cells from left-most to right-most)
    public get width(): number {
        const sorted = this.cells.sort((a, b) => a.col - b.col);
        return sorted[sorted.length - 1].col - sorted[0].col + 1;
    }

    public doesCover(loc: BoardLocation): boolean {
        let found = this._cells.find((cell: BoardLocation) => cell.row === loc.row && cell.col === loc.col);
        return !!found;
    }

    public down(): void {
        this._cells.forEach((loc: BoardLocation) => {
            loc.row++;
        });
    }

    public right(): void {
        this._cells.forEach((loc: BoardLocation) => {
            loc.col++;
        });
    }

    public left(): void {
        this._cells.forEach((loc: BoardLocation) => {
            loc.col--;
        });
    }

    public rotate(): void {
        console.log('rotate');
        this._cells.forEach((loc: BoardLocation) => {
            let newR: number = -1 * (loc.col - this.location.col) + this.location.row;
            let newC: number = (loc.row - this.location.row) + this.location.col;
            loc.row = newR;
            loc.col = newC;
        });
    }

    // Get neighboring cells affected by a RIGHT move
    public get rightAffected(): BoardLocation[] {
        // Get right-most cell from each ROW, get [row, col+1]
        let rightMost = this.cells.reduce((m: any, cell: BoardLocation) => {
            if (m[cell.row] === undefined || m[cell.row] < cell.col) m[cell.row] = cell.col;
            return m;
        }, {});

        let affected: BoardLocation[] = [];
        Object.keys(rightMost).forEach((r: string) => {
            let c: number = rightMost[r];
            affected.push(new BoardLocation(parseInt(r), c+1));
        });
        return affected;
    }

    // Get neighboring cells affected by a LEFT move
    public get leftAffected(): BoardLocation[] {
        // Get left-most cell from each ROW, get [row, col-1]
        let leftMost = this.cells.reduce((m: any, cell: BoardLocation) => {
            if (m[cell.row] === undefined || m[cell.row] > cell.col) m[cell.row] = cell.col;
            return m
        }, {});

        let affected: BoardLocation[] = [];
        Object.keys(leftMost).forEach((r: string) => {
            let c: number = leftMost[r];
            affected.push(new BoardLocation(parseInt(r), c-1));
        });
        return affected;
    }

    // Get neighboring cells affected by a DOWN move
    public get downAffected(): BoardLocation[] {
        // Get top-most cell from each COLUMN, get [row+1, col]
        let downMost = this.cells.reduce((m: any, cell: BoardLocation) => {
            if (m[cell.col] === undefined || m[cell.col] < cell.row) m[cell.col] = cell.row;
            return m
        }, {});

        let affected: BoardLocation[] = [];
        Object.keys(downMost).forEach((c: string) => {
            let r: number = downMost[c];
            affected.push(new BoardLocation(r+1, parseInt(c)));
        });
        return affected;
    }
}