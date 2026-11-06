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
    return RUNS.get(run_id)


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
    return list(EXPERIMENTS.values())
