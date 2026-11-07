import json
from typing import Any

import psycopg

from .config import get_settings

RUNS: dict[str, dict[str, Any]] = {}
EXPERIMENTS: dict[str, dict[str, Any]] = {}


def save_run(run: dict[str, Any]) -> dict[str, str]:
    RUNS[run["run_id"]] = run
    try:
        with psycopg.connect(get_settings().database_url, connect_timeout=3) as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    "CREATE TABLE IF NOT EXISTS workflow_runs (id text primary key, customer_id text, website_id text, payload jsonb)"
                )
                cursor.execute(
                    "INSERT INTO workflow_runs (id, customer_id, website_id, payload) VALUES (%s, %s, %s, %s) "
                    "ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload",
                    (run["run_id"], run["customer_id"], run["website_id"], json.dumps(run)),
                )
        return {"status": "persisted", "source": "postgres"}
    except (psycopg.Error, OSError):
        return {"status": "unavailable", "source": "postgres"}


def load_run(run_id: str) -> dict[str, Any] | None:
    if run_id in RUNS:
        return RUNS[run_id]
    try:
        with psycopg.connect(get_settings().database_url, connect_timeout=3) as connection:
            with connection.cursor() as cursor:
                cursor.execute("SELECT payload FROM workflow_runs WHERE id = %s", (run_id,))
                row = cursor.fetchone()
        if row:
            RUNS[run_id] = row[0]
            return row[0]
    except (psycopg.Error, OSError):
        return None
    return None


def save_experiment(experiment: dict[str, Any]) -> dict[str, str]:
    EXPERIMENTS[experiment["experiment_id"]] = experiment
    try:
        with psycopg.connect(get_settings().database_url, connect_timeout=3) as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    "CREATE TABLE IF NOT EXISTS seo_experiments (id text primary key, website_id text, payload jsonb)"
                )
                cursor.execute(
                    "INSERT INTO seo_experiments (id, website_id, payload) VALUES (%s, %s, %s) "
                    "ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload",
                    (experiment["experiment_id"], experiment["website_id"], json.dumps(experiment)),
                )
        return {"status": "stored", "source": "postgres"}
    except (psycopg.Error, OSError):
        return {"status": "stored", "source": "local"}


def list_experiments() -> list[dict[str, Any]]:
    try:
        with psycopg.connect(get_settings().database_url, connect_timeout=3) as connection:
            with connection.cursor() as cursor:
                cursor.execute("SELECT payload FROM seo_experiments ORDER BY id")
                rows = cursor.fetchall()
            experiments = [row[0] for row in rows]
        EXPERIMENTS.update({item["experiment_id"]: item for item in experiments})
    except (psycopg.Error, OSError):
        pass
    return list(EXPERIMENTS.values())
