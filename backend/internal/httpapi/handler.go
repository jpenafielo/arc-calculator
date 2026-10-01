package httpapi

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"strings"

	"github.com/jpenafielo/sezzle-calculator/backend/internal/calculator"
)

type calculateRequest struct {
	Operation string   `json:"operation"`
	A         *float64 `json:"a"`
	B         *float64 `json:"b"`
}

type errorResponse struct {
	Error struct {
		Code    string `json:"code"`
		Message string `json:"message"`
	} `json:"error"`
}

// NewHandler serves the API and, when staticDir is set, the built frontend.
func NewHandler(staticDir string) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/health", func(w http.ResponseWriter, _ *http.Request) {
		writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})
	mux.HandleFunc("POST /api/calculate", calculate)
	if staticDir != "" {
		mux.Handle("GET /", http.FileServer(http.Dir(staticDir)))
	}
	return mux
}

func calculate(w http.ResponseWriter, r *http.Request) {
	if mediaType := strings.ToLower(strings.TrimSpace(strings.Split(r.Header.Get("Content-Type"), ";")[0])); mediaType != "application/json" {
		writeError(w, http.StatusUnsupportedMediaType, "unsupported_media_type", "send an application/json request")
		return
	}

	var request calculateRequest
	decoder := json.NewDecoder(http.MaxBytesReader(w, r.Body, 4096))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&request); err != nil {
		writeError(w, http.StatusBadRequest, "invalid_json", "send a valid JSON object with operation and numeric inputs")
		return
	}
	if err := decoder.Decode(&struct{}{}); err != io.EOF {
		writeError(w, http.StatusBadRequest, "invalid_json", "send exactly one JSON object")
		return
	}

	result, err := calculator.Calculate(request.Operation, request.A, request.B)
	if err != nil {
		switch {
		case errors.Is(err, calculator.ErrInvalidInput):
			writeError(w, http.StatusBadRequest, "invalid_input", err.Error())
		case errors.Is(err, calculator.ErrInvalidOperation):
			writeError(w, http.StatusBadRequest, "invalid_operation", err.Error())
		case errors.Is(err, calculator.ErrDivisionByZero):
			writeError(w, http.StatusUnprocessableEntity, "division_by_zero", err.Error())
		case errors.Is(err, calculator.ErrNegativeRoot):
			writeError(w, http.StatusUnprocessableEntity, "negative_root", err.Error())
		case errors.Is(err, calculator.ErrNonFinite):
			writeError(w, http.StatusUnprocessableEntity, "non_finite_result", err.Error())
		default:
			writeError(w, http.StatusInternalServerError, "internal_error", "an unexpected error occurred")
		}
		return
	}
	writeJSON(w, http.StatusOK, map[string]float64{"result": result})
}

func writeError(w http.ResponseWriter, status int, code, message string) {
	response := errorResponse{}
	response.Error.Code = code
	response.Error.Message = message
	writeJSON(w, status, response)
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}
