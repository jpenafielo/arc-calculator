package calculator

import (
	"errors"
	"math"
	"testing"
)

func number(value float64) *float64 { return &value }

func TestCalculate(t *testing.T) {
	tests := []struct {
		name      string
		operation string
		a, b      *float64
		want      float64
		wantErr   error
	}{
		{"addition", "add", number(7), number(3), 10, nil},
		{"subtraction", "subtract", number(7), number(3), 4, nil},
		{"multiplication", "multiply", number(7), number(3), 21, nil},
		{"division", "divide", number(7), number(2), 3.5, nil},
		{"power", "power", number(2), number(3), 8, nil},
		{"square root", "sqrt", number(9), nil, 3, nil},
		{"percentage", "percent", number(25), number(80), 20, nil},
		{"division by zero", "divide", number(7), number(0), 0, ErrDivisionByZero},
		{"negative square root", "sqrt", number(-1), nil, 0, ErrNegativeRoot},
		{"overflow", "multiply", number(math.MaxFloat64), number(2), 0, ErrNonFinite},
		{"invalid power", "power", number(-1), number(0.5), 0, ErrNonFinite},
		{"missing first input", "add", nil, number(2), 0, ErrInvalidInput},
		{"missing second input", "add", number(2), nil, 0, ErrInvalidInput},
		{"non-finite input", "add", number(math.Inf(1)), number(2), 0, ErrInvalidInput},
		{"unsupported operation", "cube", number(2), number(3), 0, ErrInvalidOperation},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			got, err := Calculate(test.operation, test.a, test.b)
			if !errors.Is(err, test.wantErr) {
				t.Fatalf("Calculate() error = %v, want %v", err, test.wantErr)
			}
			if err == nil && math.Abs(got-test.want) > 1e-12 {
				t.Fatalf("Calculate() = %v, want %v", got, test.want)
			}
		})
	}
}
