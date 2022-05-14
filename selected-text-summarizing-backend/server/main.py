from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import logging
logger = logging.getLogger("api")
logger.setLevel(logging.DEBUG)

from fastapi.middleware.cors import CORSMiddleware



def get_tokenizer_model(model_path_name):
    tokenizer = AutoTokenizer.from_pretrained(pretrained_model_name_or_path=model_path_name)
    model = AutoModelForSeq2SeqLM.from_pretrained(pretrained_model_name_or_path=model_path_name)
    return tokenizer, model


def summarize(model, tokenizer, text):
    inputs = tokenizer([text], max_length=768, return_tensors="pt", truncation=True)
    summary_ids = model.generate(inputs["input_ids"], num_beams=4, max_length=60, min_length=20, no_repeat_ngram_size=2)
    summarized_text = tokenizer.batch_decode(
        summary_ids,
        skip_special_tokens=True,
        clean_up_tokenization_spaces=False)[0]
    return summarized_text


class Item(BaseModel):
    text: str


app = FastAPI()
tokenizer, model = get_tokenizer_model("../models/distilbart-xsum-12-3")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/summarize/")
async def create_item(item: Item):
    logger.debug(item.text)
    summarized_text = summarize(model, tokenizer, item.text)
    return {"summarized_text": summarized_text}
