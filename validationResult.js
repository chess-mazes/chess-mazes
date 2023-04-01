class ValidationResult {
    static ValidMove = new ValidationResult(true, "ValidMove");
    static OutOfBounds = new ValidationResult(false, "OutOfBounds");
    static FriendlyPiece = new ValidationResult(false, "FriendlyPiece");
    static EmptyStartSquare = new ValidationResult(false, "EmptyStartSquare");
    static PawnCapturingEmptySquare = new ValidationResult(false, "PawnCapturingEmptySquare");
    static EnemyPiece = new ValidationResult(false, "EnemyPiece");
    static SameSquare = new ValidationResult(false, "SameSquare");
    static BlockedPath = new ValidationResult(false, "BlockedPath");
    static InvalidMovePattern = new ValidationResult(false, "InvalidMovePattern");
    static PinnedPiece = new ValidationResult(false, "PinnedPiece");
    static KingInCheck = new ValidationResult(false, "KingInCheck");
    static KingThreatenedSquare = new ValidationResult(false, "KingThreatenedSquare");
    static CannotCastle = new ValidationResult(false, "CannotCastle");
    static CannotEnPassant = new ValidationResult(false, "CannotEnPassant");

    constructor(status, reason) {
        this.status = status;
        this.reason = reason;
    }

    toString() {
        return `ValidationResult { status: ${this.status}, reason: ${this.reason} }`;
    }
}

export default ValidationResult;
