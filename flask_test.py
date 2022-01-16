from re import finditer
import requests
import urllib.request as libreq
import json
import openai
from flask import Flask
import os
app = Flask(__name__)


@app.route("/<string:words>")
def basic_translate(words):
    trans = googletrans.Translator()
    return trans.translate(words, src="en", dest="es")


@ app.route("/<string:name>/<int:toy>")
def hello_name(name, toy):
    return "hello "+name+"You get ", toy, "toys."


@app.route("/<string:topic>/<int:results>/<string:language>")
def arxiv_topic_search(topic, results, language):
    print(language)
    with libreq.urlopen('http://export.arxiv.org/api/query?search_query=all:'+str(topic)+'&start=0&max_results='+str(results)) as url:
        r = url.read()
    r = str(r)
    print(r)
    final_texts = []
    starts = [i for i in range(len(r)) if r.startswith("<id>", i)]
    ends = [i for i in range(len(r)) if r.startswith("</id>", i)]
    sum_starts = [i for i in range(len(r)) if r.startswith("<summary>", i)]
    sum_ends = [i for i in range(len(r)) if r.startswith("</summary>", i)]
    tags = []
    tag_starts = [i for i in range(len(r)) if r.startswith("<", i)]
    tag_ends = [i for i in range(len(r)) if r.startswith(">", i)]
    final_sums = []
    for i in range(len(ends)):
        if "api" not in r[starts[i]:ends[i]]:
            final_texts.append(r[starts[i]:ends[i]])
    for i in range(len(sum_ends)):
        final_sums.append(r[sum_starts[i]:sum_ends[i]])
    for i in range(len(tag_starts)):
        tags.append(r[tag_starts[i]:tag_ends[i]])
    for i in range(len(tags)):
        tag = tags[i]
        if tag.startswith("</") or tag.startswith("?/"):
            tags[i] = tag[2:]
        elif tag.startswith("<"):
            tags[i] = tag[1:]
    i = 0
    while i < len(tags):
        mark = False
        remove = []
        for j in range(len(tags)):
            if tags[i] in tags[j] and i != j and len(tags[i]) < len(tags[j]):
                remove.append(i)
                mark = True
        for r in remove:
            tags = tags[0:r]+tags[r+1:]
        if mark == False:
            i += 1
    tags = set(tags)
    for i in range(len(final_sums)):
        sum = final_sums[i]
    final_sums[i] = sum.replace("<summary>", "")
    final_sums[i] = final_sums[i].replace("</summary>", "")
    # If this doesn't work, try os.environ.get("OPENAI_API_KEY")
    openai.api_key = "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"
    summarized_sum = []
    tl_dr_txt = []
    for txt in final_sums:
        summary = txt
        response = openai.Completion.create(
            engine="davinci",
            prompt=summary+"tl;dr:",
            temperature=0.4,
            max_tokens=100,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0,
            stop=["\"\"\""])
        tl_dr_txt.append(response)
    for tl in tl_dr_txt:
        summ = tl["choices"][0]["text"]
        stops = finditer(".", summ)
        summarized_sum.append(summ.replace("\n", "").replace(
            "\\n", "").replace("\t", "").replace("\\t", ""))[:stops[-1]]
    #translator = googletrans.Translator()
    for si in range(len(summarized_sum)):
        summ = summarized_sum[si]
        transReq = {
            "contents": [
                summ
            ],
            "targetLanguageCode": language,
        }
        # summarized_sum[i] = requests.get("https://libretranslate.com/translate/ -d "q=summ & source="en" & target=language & format="txt")
        # summarized_sum[si] = requests.post(https: // www.translated.net/hts /?f={summ} & cid=htsdemo & p=htsdemo5 & s=english & t=italian & w=1000 & of=json)
        # "https://translate.googleapis.com/v3beta1/projects/7816664567/locations/global:translateText")
    return json.dumps(summarized_sum)

# @app.route("/?topic=topic&results=results&language")


@app.route("/langs")
def langs():
    import requests
    import json
    langs = requests.get("https://libretranslate.com/languages")
    out = json.dumps(str(langs.content))
    out = out.replace("//", "").replace("/", "").replace('\\', "")
    return out


@app.route("/arxiv-topic/<string:topic>/<int:results>/<string:language>")
def topic_search(topic: str, results: int, language: str):
    #topic = request.args.get("topic")
    #results = request.args.get("results")
    #language = request.args.get("language")
    with libreq.urlopen('http://export.arxiv.org/api/query?search_query=all:'+str(topic)+'&start=0&max_results='+str(results)) as url:
        r = url.read()
    r = str(r)
    final_texts = []
    starts = [i for i in range(len(r)) if r.startswith("<id>", i)]
    ends = [i for i in range(len(r)) if r.startswith("</id>", i)]
    sum_starts = [i for i in range(len(r)) if r.startswith("<summary>", i)]
    sum_ends = [i for i in range(len(r)) if r.startswith("</summary>", i)]
    tags = []
    tag_starts = [i for i in range(len(r)) if r.startswith("<", i)]
    tag_ends = [i for i in range(len(r)) if r.startswith(">", i)]
    final_sums = []
    for i in range(len(ends)):
        if "api" not in r[starts[i]:ends[i]]:
            final_texts.append(r[starts[i]:ends[i]])
    for i in range(len(sum_ends)):
        final_sums.append(r[sum_starts[i]:sum_ends[i]])
    for i in range(len(tag_starts)):
        tags.append(r[tag_starts[i]:tag_ends[i]])
    for i in range(len(tags)):
        tag = tags[i]
        if tag.startswith("</") or tag.startswith("?/"):
            tags[i] = tag[2:]
        elif tag.startswith("<"):
            tags[i] = tag[1:]
    i = 0
    while i < len(tags):
        mark = False
        remove = []
        for j in range(len(tags)):
            if tags[i] in tags[j] and i != j and len(tags[i]) < len(tags[j]):
                remove.append(i)
                mark = True
        for r in remove:
            tags = tags[0:r]+tags[r+1:]
        if mark == False:
            i += 1
    tags = set(tags)
    for i in range(len(final_sums)):
        sum = final_sums[i]
    final_sums[i] = sum.replace("<summary>", "")
    final_sums[i] = final_sums[i].replace("</summary>", "")
    openai.api_key = os.getenv("OPENAI_API_KEY")
    summarized_sum = []
    tl_dr_txt = []
    translator = googletrans.Translator()
    for txt in final_sums:
        summary = txt
        response = openai.Completion.create(
            engine="davinci",
            prompt=summary+"tl;dr:",
            temperature=0.4,
            max_tokens=100,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0,
            stop=["\"\"\""])
        tl_dr_txt.append(response)
    for tl in tl_dr_txt:
        summ = tl["choices"][0]["text"]
        end = summ.finditer(".")[-1]
        summ = summ.replace("\n", "").replace(
            "\\n", "").replace("\t", "")[:end]
        print(summ)
        summarized_sum.append(translator.translate(
            summ, src="en", dest=language).text)
    return json.dumps(summarized_sum)


# Open Command Line and run Flask Server by calling python flask_test.py
# Change from production to development, export FLASK_ENV = DEVELOPMENT
# Can return HTML in functions

if __name__ == "__main__":
    app.run(debug=True)
