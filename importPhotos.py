from pathlib import Path
import sqlite3
from PIL import Image
from random import uniform

input_folder = ""

dbpath = "./backend/db/db.sqlite"

files = list(Path(input_folder).glob('**/*.jpg'))
print("found {} files".format(len(files)))

print("connect to db")

con = sqlite3.connect(dbpath)
cur = con.cursor()

product_sql = "INSERT INTO Produkt(Bezeichnung, MehrwertsteuerID, Details, Nettopreis, DownloadID, FileName, OriginalResolution) VALUES(?,?, ?,?, ?,?,?);"
download_sql = "INSERT INTO Download(Bezeichnung, Beschreibung, Bildpfad) VALUES(?,?,?);"
product_img_sql = "INSERT INTO Produktbild(Bildpfad, ProduktID) VALUES(?, ?);"
tag_sql = "INSERT INTO Produkt2Tags (ProduktID, TagID) VALUES(?, ?);"

tags = ['tenerife', 'animals', 'industry', 'rome', 'china', 'cars', 'nightshot', 'nature', 'mountains', 'snow', 'sports', 'mountainbike', 'handball', 'skiing', 'makro', 'humans', 'brazil', 'australia', 'wildlife', 'food', 'portraits']
for f in files:
    print("{}".format(f))
    fname = f.name
    img = Image.open(f)
    img.show()
    title = input("title: ")
    details = input("details: ")
    t = ", ".join(["{}: {}".format(i + 1, tag) for i, tag in enumerate(tags)])
    print(t)
    usertags = list(set(input("tags('1;2;3'): ").split(';')))
    img_path = Path("media", f.name)

    print("\t[+] insert into download")
    cur.execute(download_sql, (title, details, img_path.as_posix()))
    downloadId = cur.lastrowid

    print("\t[+] insert into product")
    # Mehrwertsteuersatz immer 1?
    product_data = (title, 1, details, round(uniform(5.0, 250.0), 2), downloadId, f.name, str(img.size))
    cur.execute(product_sql, product_data)
    productId = cur.lastrowid
    print("\t[+] insert into productImg")
    cur.execute(product_img_sql, (img_path.as_posix(), productId))
    for tag in usertags:
        try:
            tag = int(tag)
        except Exception as e:
            print(e)
            continue
        if tag < 0 or tag >= len(tags):
            print("tag '{}' not known (0 < tag < {})".format(tag, len(tags)))
            continue
        cur.execute(tag_sql, (productId, tag))
    print("\t[+] insert into tags")
    con.commit()
