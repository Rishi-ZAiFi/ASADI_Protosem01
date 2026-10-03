import pytest
import sys
from unittest.mock import patch, MagicMock
from app.services.embedding_service import EmbeddingService
from app.services.image_analyzer import ImageAnalyzer
from app.services.text_analyzer import TextAnalyzer, get_nlp
import numpy as np

def test_embedding_service_empty_text():
    es = EmbeddingService()
    with pytest.raises(ValueError, match="Cannot generate embedding for empty text"):
        es.generate_embedding("   ")

def test_embedding_service_missing_import():
    with patch.dict("os.environ", {}, clear=False):
        import os
        os.environ.pop("TEST_FAKE_EMBEDDINGS", None)
        with patch("app.services.embedding_service.SentenceTransformer", None):
            with pytest.raises(ImportError, match="sentence_transformers is not installed"):
                EmbeddingService()

@patch("app.services.image_analyzer.pytesseract")
def test_image_analyzer_ocr_failure(mock_pytesseract):
    mock_pytesseract.image_to_string.side_effect = Exception("OCR Engine failed")
    
    with pytest.raises(RuntimeError, match="OCR extraction failed"):
        # We need a mock image to pass to extract_features, or we can mock PIL
        with patch("app.services.image_analyzer.Image.open") as mock_open:
            mock_img = MagicMock()
            mock_img.size = (100, 100)
            mock_open.return_value.convert.return_value = mock_img
            
            with patch("app.services.image_analyzer.os.path.exists", return_value=True):
                # Mock cv2 so it doesn't fail on cvtColor
                with patch("app.services.image_analyzer.cv2") as mock_cv2:
                    mock_cv2.cvtColor.return_value = np.zeros((100, 100, 3), dtype=np.uint8)
                    mock_cv2.Canny.return_value = np.zeros((100, 100), dtype=np.uint8)
                    
                    with patch("app.services.image_analyzer.ImageAnalyzer._get_dominant_colors", return_value=["#000000"]):
                        ImageAnalyzer.extract_features("fake_path.jpg")

@patch("app.services.image_analyzer.cv2")
def test_image_analyzer_kmeans_failure(mock_cv2):
    mock_cv2.kmeans.side_effect = Exception("Clustering failed")
    
    # Random pixels
    pixels = np.zeros((100, 100, 3), dtype=np.uint8)
    with pytest.raises(RuntimeError, match="Color clustering failed"):
        ImageAnalyzer._get_dominant_colors(pixels)

def test_text_analyzer_spacy_failure():
    with patch("app.services.text_analyzer.spacy.load", side_effect=Exception("Model not found")):
        # We need to reset the global _nlp to None for the test
        import app.services.text_analyzer as ta
        ta._nlp = None
        
        with pytest.raises(RuntimeError, match="Failed to load spacy model"):
            ta.get_nlp()
