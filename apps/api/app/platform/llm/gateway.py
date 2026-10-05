from pydantic import BaseModel


class FakeLLM:
    async def generate_structured(self, prompt: str, schema: type[BaseModel], **kwargs) -> BaseModel:
        # Returns a dummy populated model for testing
        dummy_data = {}
        for field_name, field in schema.model_fields.items():
            if field.annotation == str:
                dummy_data[field_name] = "dummy text"
            elif field.annotation == int:
                dummy_data[field_name] = 1
            elif field.annotation == list or getattr(field.annotation, '__origin__', None) == list:
                dummy_data[field_name] = []
            else:
                dummy_data[field_name] = None
        return schema(**dummy_data)

gateway = FakeLLM()
