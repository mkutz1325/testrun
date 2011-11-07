from django.http import HttpResponse
from django.contrib.auth.models import User
from django.template import Context
from django.template.loader import get_template


def home_page(request):
    template = get_template('home_page.html')
    output = template
        
    return HttpResponse(output)
