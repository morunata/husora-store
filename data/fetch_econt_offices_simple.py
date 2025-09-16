import json
import requests
from requests.auth import HTTPBasicAuth

# API адреси
ECONT_URL = "https://ee.econt.com/services/Nomenclatures/NomenclaturesService.getOffices.json"
ECONT_DEMO_URL = "https://demo.econt.com/ee/services/Nomenclatures/NomenclaturesService.getOffices.json"
ECONT_DEMO_USER = "iasp-dev"
ECONT_DEMO_PASS = "1Asp-dev"

def fetch_econt_offices(country_code="BGR"):
    payload = {"GetOfficesRequest": {"countryCode": country_code}}
    headers = {"Content-Type": "application/json; charset=utf-8"}
    try:
        r = requests.post(ECONT_URL, json=payload, headers=headers, timeout=30)
        if r.status_code == 200:
            return r.json()
        else:
            # fallback demo API
            r2 = requests.post(ECONT_DEMO_URL, json=payload, headers=headers,
                               auth=HTTPBasicAuth(ECONT_DEMO_USER, ECONT_DEMO_PASS), timeout=30)
            if r2.status_code == 200:
                return r2.json()
            return None
    except Exception as e:
        print("Грешка при заявка към Еконт:", e)
        return None

def simplify_econt_offices(raw_offices):
    simplified = []
    for o in raw_offices:
        city = o.get("address", {}).get("city", {})
        country = city.get("country", {})
        # филтрираме само България
        if country.get("code2") != "BG":
            continue
        simplified.append({
            "id": o.get("id"),
            "name": o.get("name"),
            "city": city.get("name"),
            "region": city.get("regionName") or city.get("name"),
            "address": o.get("address", {}).get("fullAddress")
        })
    return simplified

def main():
    raw_data = fetch_econt_offices()
    if not raw_data:
        print("Не успях да взема данни от Еконт.")
        return

    # някои API връщат { "offices": [...] }, други директно масив
    offices = raw_data.get("offices") if isinstance(raw_data, dict) else raw_data
    if not offices:
        print("Няма офиси в отговора.")
        return

    simplified = simplify_econt_offices(offices)
    with open("econt_offices.json", "w", encoding="utf-8") as f:
        json.dump(simplified, f, ensure_ascii=False, indent=2)

    print(f"Записани {len(simplified)} офиса в econt_offices.json")

if __name__ == "__main__":
    main()
