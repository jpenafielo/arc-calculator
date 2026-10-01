package httpapi

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestCalculateEndpoint(t *testing.T) {
	tests := []struct {
		name, body, contentType string
		wantStatus              int
		wantResult              float64
		wantCode                string
	}{
		{"success", `{"operation":"add","a":5,"b":2}`, "application/json", http.StatusOK, 7, ""},
		{"square root", `{"operation":"sqrt","a":9}`, "application/json", http.StatusOK, 3, ""},
		{"division by zero", `{"operation":"divide","a":5,"b":0}`, "application/json", http.StatusUnprocessableEntity, 0, "division_by_zero"},
		{"negative root", `{"operation":"sqrt","a":-4}`, "application/json", http.StatusUnprocessableEntity, 0, "negative_root"},
		{"non-finite result", `{"operation":"multiply","a":1e308,"b":1e308}`, "application/json", http.StatusUnprocessableEntity, 0, "non_finite_result"},
		{"unsupported operation", `{"operation":"cube","a":5}`, "application/json", http.StatusBadRequest, 0, "invalid_operation"},
		{"missing operand", `{"operation":"add","a":5}`, "application/json", http.StatusBadRequest, 0, "invalid_input"},
		{"unknown field", `{"operation":"add","a":5,"b":2,"extra":1}`, "application/json", http.StatusBadRequest, 0, "invalid_json"},
		{"trailing JSON", `{"operation":"add","a":5,"b":2}{}`, "application/json", http.StatusBadRequest, 0, "invalid_json"},
		{"invalid number", `{"operation":"add","a":"five","b":2}`, "application/json", http.StatusBadRequest, 0, "invalid_json"},
		{"wrong media type", `{"operation":"add","a":5,"b":2}`, "text/plain", http.StatusUnsupportedMediaType, 0, "unsupported_media_type"},
		{"too large", strings.Repeat(" ", 5000), "application/json", http.StatusBadRequest, 0, "invalid_json"},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodPost, "/api/calculate", strings.NewReader(test.body))
			req.Header.Set("Content-Type", test.contentType)
			recorder := httptest.NewRecorder()
			NewHandler("").ServeHTTP(recorder, req)

			if recorder.Code != test.wantStatus {
				t.Fatalf("status = %d, want %d; body = %s", recorder.Code, test.wantStatus, recorder.Body.String())
			}
			var response struct {
				Result float64 `json:"result"`
				Error  struct {
					Code string `json:"code"`
				} `json:"error"`
			}
			if err := json.Unmarshal(recorder.Body.Bytes(), &response); err != nil {
				t.Fatalf("decode response: %v", err)
			}
			if response.Result != test.wantResult || response.Error.Code != test.wantCode {
				t.Fatalf("response = %+v, want result %v and code %q", response, test.wantResult, test.wantCode)
			}
		})
	}
}

func TestHealthEndpoint(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/health", nil)
	recorder := httptest.NewRecorder()
	NewHandler("").ServeHTTP(recorder, req)
	if recorder.Code != http.StatusOK || !strings.Contains(recorder.Body.String(), `"ok"`) {
		t.Fatalf("unexpected health response: %d %s", recorder.Code, recorder.Body.String())
	}
}

func TestServesBuiltFrontend(t *testing.T) {
	staticDir := t.TempDir()
	if err := os.WriteFile(filepath.Join(staticDir, "index.html"), []byte("<!doctype html><title>Arc</title>"), 0o600); err != nil {
		t.Fatal(err)
	}
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	recorder := httptest.NewRecorder()
	NewHandler(staticDir).ServeHTTP(recorder, req)
	if recorder.Code != http.StatusOK || !strings.Contains(recorder.Body.String(), "<title>Arc</title>") {
		t.Fatalf("unexpected frontend response: %d %s", recorder.Code, recorder.Body.String())
	}
}
