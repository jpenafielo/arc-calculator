package calculator

import (
	"errors"
	"math"
)

var (
	ErrInvalidInput     = errors.New("enter a valid number for each required input")
	ErrInvalidOperation = errors.New("choose a supported operation")
	ErrDivisionByZero   = errors.New("cannot divide by zero")
	ErrNegativeRoot     = errors.New("cannot take the square root of a negative number")
	ErrNonFinite        = errors.New("result is outside the supported numeric range")
)

// Calculate performs one operation. B is optional only for square root.
func Calculate(operation string, a, b *float64) (float64, error) {
	switch operation {
	case "add", "subtract", "multiply", "divide", "power", "sqrt", "percent":
	default:
		return 0, ErrInvalidOperation
	}
	if a == nil || !isFinite(*a) {
		return 0, ErrInvalidInput
	}
	if operation != "sqrt" && (b == nil || !isFinite(*b)) {
		return 0, ErrInvalidInput
	}

	var result float64
	switch operation {
	case "add":
		result = *a + *b
	case "subtract":
		result = *a - *b
	case "multiply":
		result = *a * *b
	case "divide":
		if *b == 0 {
			return 0, ErrDivisionByZero
		}
		result = *a / *b
	case "power":
		result = math.Pow(*a, *b)
	case "sqrt":
		if *a < 0 {
			return 0, ErrNegativeRoot
		}
		result = math.Sqrt(*a)
	case "percent":
		result = (*a / 100) * *b
	}

	if !isFinite(result) {
		return 0, ErrNonFinite
	}
	return result, nil
}

func isFinite(value float64) bool {
	return !math.IsNaN(value) && !math.IsInf(value, 0)
}
