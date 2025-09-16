#!/usr/bin/env python3
"""
fetch_courier_offices.py
- Записва econt_offices.json и speedy_offices.json в текущата папка.
- Инструкции в README секцията по-долу.
"""

import json
import os
import sys
import time
from typing import Optional

import requests
from requests.auth import HTTPBasicAuth

# ---------- CONFIG ----------
OUT_DIR = "."  # промени ако искаш друга папка
ECONT_URL = "https://ee.econt.com/services/Nomenclatures/NomenclaturesService.getOffices.json"
ECONT_DEMO_URL = "https://demo.econt.com/ee/services/Nomenclatures/NomenclaturesService.getOffices.json"
# demo creds, използвай само за тестове / ако публичният endpoint изисква автентикация
ECONT_DEMO_USER = "iasp-dev"
ECONT_DEMO_PASS = "1Asp-dev"

# Speedy: Постави своя ключ/креденшъли тук. Ако нямаш, остави празно и скриптът няма да се опита да вика Speedy API.
SPEEDY_API_ENDPOINT = ""  # примерно: "https://api.speedy.bg/some/findOffice"
SPEEDY_API_KEY = ""       # ако имаш -> въведи тук
# ----------------------------

def save_json(obj, path):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=2)
    print(f"Saved: {path}")

# ---------- ECONT ----------
def fetch_econt_offices(country_code="BGR", use_demo_if_needed=True) -> Optional[dict]:
    payload = {"GetOfficesRequest": {"countryCode": country_code}}
    headers = {"Content-Type": "application/json; charset=utf-8"}
    print(f"Requesting Econt offices (countryCode={country_code}) from {ECONT_URL} ...")
    try:
        r = requests.post(ECONT_URL, json=payload, headers=headers, timeout=30)
        print(f"Econt response HTTP {r.status_code}")
        if r.status_code == 200:
            return r.json()
        else:
            print("Неуспешен опит (възможно изискване на автентикация).")
            if use_demo_if_needed:
                print("Опитваме demo endpoint с demo креденшъли...")
                try:
                    r2 = requests.post(ECONT_DEMO_URL, json=payload, headers=headers,
                                       auth=HTTPBasicAuth(ECONT_DEMO_USER, ECONT_DEMO_PASS), timeout=30)
                    print(f"Demo response HTTP {r2.status_code}")
                    if r2.status_code == 200:
                        return r2.json()
                    else:
                        print("Demo опитът също не успя. Код:", r2.status_code)
                        return None
                except Exception as e:
                    print("Грешка при demo заявка:", e)
                    return None
            return None
    except Exception as e:
        print("Грешка при Econt заявка:", e)
        return None

# ---------- SPEEDY ----------
def fetch_speedy_offices() -> Optional[dict]:
    """
    Speedy често изисква API ключ / регистрация. Тук сме оставили шаблон:
    - Ако зададеш SPEEDY_API_ENDPOINT и SPEEDY_API_KEY, функцията ще направи GET/POST според това което е нужно.
    - Ако нямаш ключ, скриптът няма да опитва автоматично (за да не рискува rate limit / блокиране).
    """
    if not SPEEDY_API_ENDPOINT:
        print("SPEEDY_API_ENDPOINT не е зададен. Пропускане на автоматично теглене за Speedy.")
        return None

    headers = {"Accept": "application/json"}
    if SPEEDY_API_KEY:
        # пример: някои API-та очакват Authorization: Bearer <key>
        headers["Authorization"] = f"Bearer {SPEEDY_API_KEY}"

    print(f"Requesting Speedy offices from {SPEEDY_API_ENDPOINT} ...")
    try:
        # Режим GET или POST зависи от конкретния Speedy endpoint; тук ползваме GET ако endpoint изглежда като URL с query
        r = requests.get(SPEEDY_API_ENDPOINT, headers=headers, timeout=30, params={})
        print("Speedy response HTTP", r.status_code)
        if r.status_code == 200:
            return r.json()
        else:
            print("Неуспешен отговор от Speedy. Код:", r.status_code)
            print("Отговор (първи 500 байта):", r.text[:500])
            return None
    except Exception as e:
        print("Грешка при Speedy заявка:", e)
        return None

# ---------- MAIN ----------
def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    # 1) Econt
    econt_data = fetch_econt_offices()
    if econt_data:
        out_path = os.path.join(OUT_DIR, "econt_offices.json")
        save_json({"fetched_at": time.strftime("%Y-%m-%dT%H:%M:%SZ"), "source": ECONT_URL, "data": econt_data}, out_path)
    else:
        print("Econt: неуспешно изтегляне. Провери мрежата/креденшълите/endpoint.")

    # 2) Speedy
    speedy_data = fetch_speedy_offices()
    if speedy_data:
        out_path = os.path.join(OUT_DIR, "speedy_offices.json")
        save_json({"fetched_at": time.strftime("%Y-%m-%dT%H:%M:%SZ"), "source": SPEEDY_API_ENDPOINT, "data": speedy_data}, out_path)
    else:
        print("Speedy: няма автоматично изтеглени данни.")
        # Вместо това: записваме примерен/празен файл (за да не се чупи проектът)
        out_path = os.path.join(OUT_DIR, "speedy_offices.json")
        save_json({"fetched_at": time.strftime("%Y-%m-%dT%H:%M:%SZ"), "source": SPEEDY_API_ENDPOINT or "none", "data": []}, out_path)
        print(f"Записахме празен placeholder: {out_path}")

    print("Готово.")

if __name__ == "__main__":
    main()
