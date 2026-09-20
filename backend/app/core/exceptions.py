class FairStandError(Exception):
    pass


class UnauthorizedError(FairStandError):
    pass


class ForbiddenError(FairStandError):
    pass
