"""Add extracted_hook, extracted_cta, extraction_source, and extraction_status to post_text_features

Revision ID: e71b93f2810a
Revises: cd52d08bc5b8
Create Date: 2026-09-29 16:12:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'e71b93f2810a'
down_revision: Union[str, Sequence[str], None] = 'cd52d08bc5b8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('post_text_features', sa.Column('extracted_hook', sa.Text(), nullable=True))
    op.add_column('post_text_features', sa.Column('extracted_cta', sa.Text(), nullable=True))
    op.add_column('post_text_features', sa.Column('extraction_source', sa.String(), nullable=True))
    op.add_column('post_text_features', sa.Column('extraction_status', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('post_text_features', 'extraction_status')
    op.drop_column('post_text_features', 'extraction_source')
    op.drop_column('post_text_features', 'extracted_cta')
    op.drop_column('post_text_features', 'extracted_hook')
